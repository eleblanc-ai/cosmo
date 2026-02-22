import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExtractedSource {
  label: string
  title: string
  ingredients: string[]
  instructions: string[]
}

interface AiContext {
  flavor_profile: string
  highlights: string[]
  pitfalls: string[]
  notes: string
}

interface WorkshopAnalysis {
  general_context: AiContext
  source_insights: { label: string; insights: string[] }[]
  recipe: { ingredients: string[]; instructions: string[] }
}

function stripHtml(html: string): string {
  let text = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
  text = text.replace(/<[^>]+>/g, ' ')
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
  return text.replace(/\s+/g, ' ').trim()
}

function stripStepNumber(s: string): string {
  return s.trim().replace(/^\d+[.)]\s*/, '')
}

async function extractRecipe(text: string, apiKey: string): Promise<{ title: string; ingredients: string[]; instructions: string[] }> {
  const fallback = { title: '', ingredients: [], instructions: [] }
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      temperature: 0,
      messages: [{
        role: 'user',
        content: `Extract the recipe from this text. Use ONLY content present verbatim in the text below — do NOT use any prior knowledge or invent content. Return ONLY valid JSON with this exact structure, no explanation:
{"title":"Recipe name","ingredients":["item 1","item 2"],"instructions":["Step 1.","Step 2."]}
If the text does not contain a recipe, return exactly:
{"title":"","ingredients":[],"instructions":[]}

Text:
${text}`,
      }],
    }),
  })
  if (!response.ok) return fallback
  try {
    const data = await response.json()
    const raw = (data.content[0]?.text ?? '').trim()
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
    const parsed = JSON.parse(clean)
    return {
      title: typeof parsed.title === 'string' ? parsed.title : '',
      ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : [],
      instructions: Array.isArray(parsed.instructions) ? parsed.instructions : [],
    }
  } catch {
    return fallback
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing authorization' }), {
      status: 401,
      headers: corsHeaders,
    })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  )

  const jwt = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabase.auth.getUser(jwt)
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: corsHeaders,
    })
  }

  const { description, sources } = await req.json() as { description: string; sources: { url: string }[] }
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY') ?? ''

  // Step 1: Fetch and extract content from each source URL
  const extracted: ExtractedSource[] = await Promise.all(
    sources.map(async (source, i) => {
      const label = `Source ${i + 1}`
      try {
        const res = await fetch(source.url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RecipeLab/1.0)' },
          signal: AbortSignal.timeout(10_000),
        })
        const html = await res.text()
        const text = stripHtml(html).slice(0, 8_000)
        const recipe = await extractRecipe(text, apiKey)
        return { label, ...recipe }
      } catch {
        return { label, title: '', ingredients: [], instructions: [] }
      }
    }),
  )

  // Step 2: Build source summary for Claude
  const sourceSummary = extracted
    .filter(s => s.ingredients.length > 0 || s.instructions.length > 0)
    .map((s) => {
      const ingredients = s.ingredients.length > 0
        ? `Ingredients:\n${s.ingredients.map(x => `- ${x}`).join('\n')}`
        : ''
      const instructions = s.instructions.length > 0
        ? `Instructions:\n${s.instructions.map(x => `- ${x}`).join('\n')}`
        : ''
      const name = s.title || s.label
      return `--- ${s.label}: ${name} ---\n${ingredients}\n${instructions}`.trim()
    })
    .join('\n\n')

  if (!sourceSummary) {
    return new Response(JSON.stringify({ error: 'No recipe content could be extracted from the provided sources' }), {
      status: 422,
      headers: corsHeaders,
    })
  }

  // Step 3: Call Claude for analysis + initial recipe
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `You are a professional recipe writer and culinary analyst. The user wants to make: "${description}".

You have been given ingredients and instructions from multiple source recipes. Your job is to:
1. Analyze these sources and write a culinary context block
2. Identify what is unique or notable about each individual source
3. Merge them into a single coherent starting-point recipe

Do NOT include step numbers in the instructions array — the app adds them automatically.

Return ONLY compact single-line JSON with no explanation, no markdown fences, no literal newlines inside string values:
{"general_context":{"flavor_profile":"1-2 sentence flavor description","highlights":["key technique 1","key technique 2"],"pitfalls":["common mistake 1","common mistake 2"],"notes":"1-2 sentence note on ingredient variations across sources"},"source_insights":[{"label":"Source 1","insights":["unique thing 1","unique thing 2"]}],"recipe":{"ingredients":["..."],"instructions":["..."]}}

${sourceSummary}`,
      }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('Anthropic API error:', response.status, err)
    return new Response(JSON.stringify({ error: 'Failed to analyze sources' }), {
      status: 500,
      headers: corsHeaders,
    })
  }

  try {
    const data = await response.json()
    const raw = (data.content[0]?.text ?? '').trim()
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()

    // Extract first complete JSON object via brace-depth counting
    const jsonStart = clean.indexOf('{')
    let jsonOnly = clean
    if (jsonStart !== -1) {
      let depth = 0; let inStr = false; let esc = false
      for (let i = jsonStart; i < clean.length; i++) {
        const ch = clean[i]
        if (esc) { esc = false; continue }
        if (ch === '\\' && inStr) { esc = true; continue }
        if (ch === '"') { inStr = !inStr; continue }
        if (inStr) continue
        if (ch === '{') depth++
        if (ch === '}') { depth--; if (depth === 0) { jsonOnly = clean.slice(jsonStart, i + 1); break } }
      }
    }

    // Escape literal control chars inside string values
    const sanitized = jsonOnly.replace(/("(?:[^"\\]|\\.)*")/g, (match) =>
      match.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')
    )

    const parsed = JSON.parse(sanitized) as WorkshopAnalysis
    const ctx = parsed.general_context
    const result: WorkshopAnalysis = {
      general_context: (ctx && typeof ctx.flavor_profile === 'string' && Array.isArray(ctx.highlights) && Array.isArray(ctx.pitfalls) && typeof ctx.notes === 'string')
        ? ctx
        : { flavor_profile: '', highlights: [], pitfalls: [], notes: '' },
      source_insights: Array.isArray(parsed.source_insights)
        ? parsed.source_insights.filter(s => typeof s.label === 'string' && Array.isArray(s.insights))
        : [],
      recipe: (parsed.recipe && Array.isArray(parsed.recipe.ingredients) && Array.isArray(parsed.recipe.instructions))
        ? {
            ingredients: parsed.recipe.ingredients,
            instructions: parsed.recipe.instructions.map(stripStepNumber),
          }
        : { ingredients: [], instructions: [] },
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('Parse error:', e)
    return new Response(JSON.stringify({ error: 'Failed to parse analysis' }), {
      status: 500,
      headers: corsHeaders,
    })
  }
})

import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SourceContent {
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

interface GeneratedRecipe {
  ingredients: string[]
  instructions: string[]
  ai_context?: AiContext
}

function stripStepNumber(s: string): string {
  return s.trim().replace(/^\d+[.)]\s*/, '')
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

  const { sources } = await req.json() as { sources: SourceContent[] }
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY') ?? ''

  const sourceSummary = sources
    .filter(s => s.ingredients.length > 0 || s.instructions.length > 0)
    .map((s, i) => {
      const name = s.title || s.label
      const ingredients = s.ingredients.length > 0
        ? `Ingredients:\n${s.ingredients.map(x => `- ${x}`).join('\n')}`
        : ''
      const instructions = s.instructions.length > 0
        ? `Instructions:\n${s.instructions.map((x, j) => `${j + 1}. ${x}`).join('\n')}`
        : ''
      return `--- Source ${i + 1}: ${name} ---\n${ingredients}\n${instructions}`.trim()
    })
    .join('\n\n')

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
        content: `You are a professional recipe writer. You have been given ingredients and instructions from multiple source recipes below. Merge them into a single coherent recipe that captures the best of all sources. Where quantities conflict, use the most common or middle value. Write clear, concise instructions. Do NOT include step numbers in the instructions array — the app adds them automatically.

Also write a brief culinary context block about the recipe.

Return ONLY compact single-line JSON with no explanation, no markdown fences, no literal newlines inside string values:
{"ingredients":["..."],"instructions":["..."],"ai_context":{"flavor_profile":"1-2 sentence flavor description","highlights":["key technique 1","key technique 2"],"pitfalls":["common mistake 1","common mistake 2"],"notes":"1-2 sentence note on interesting ingredient variations across sources"}}

${sourceSummary}`,
      }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('Anthropic API error:', response.status, err)
    return new Response(JSON.stringify({ error: 'Failed to generate recipe' }), {
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
    const parsed = JSON.parse(sanitized) as GeneratedRecipe
    const ctx = parsed.ai_context
    const result: GeneratedRecipe = {
      ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : [],
      instructions: Array.isArray(parsed.instructions) ? parsed.instructions.map(stripStepNumber) : [],
    }
    if (ctx && typeof ctx.flavor_profile === 'string' && Array.isArray(ctx.highlights) && Array.isArray(ctx.pitfalls) && typeof ctx.notes === 'string') {
      result.ai_context = ctx
    }
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('Parse error:', e)
    return new Response(JSON.stringify({ error: 'Failed to parse recipe' }), {
      status: 500,
      headers: corsHeaders,
    })
  }
})

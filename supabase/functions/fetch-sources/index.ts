import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RecipeSource {
  url?: string
  raw_text?: string
}

interface ExtractedRecipe {
  title: string
  ingredients: string[]
  instructions: string[]
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

async function extractRecipe(text: string, apiKey: string): Promise<ExtractedRecipe> {
  const fallback: ExtractedRecipe = {
    title: '',
    ingredients: [],
    instructions: [],
  }

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

  if (!response.ok) {
    console.error('Anthropic API error:', response.status, await response.text())
    return fallback
  }

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
  } catch (e) {
    console.error('Parse error:', e)
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

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY') ?? ''
  const { sources } = await req.json() as { sources: RecipeSource[] }

  const contents = await Promise.all(
    sources.map(async (source, i) => {
      let text: string
      let label: string

      if (source.url) {
        try {
          const res = await fetch(source.url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RecipeLab/1.0)' },
            signal: AbortSignal.timeout(10_000),
          })
          const html = await res.text()
          text = stripHtml(html).slice(0, 8_000)
          label = new URL(source.url).hostname
        } catch {
          label = new URL(source.url).hostname
          return { label, ingredients: [], instructions: [] }
        }
      } else {
        text = source.raw_text ?? ''
        label = `Text source ${i + 1}`
      }

      const extracted = await extractRecipe(text, apiKey)
      return { label, ...extracted }
    }),
  )

  return new Response(JSON.stringify({ contents }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})

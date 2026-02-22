import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RecipeSnapshot {
  title: string
  ingredients: string[]
  instructions: string[]
}

interface ChatMessageInput {
  role: 'user' | 'assistant'
  content: string
}

interface ChatResponse {
  message: string
  recipe: {
    ingredients: string[]
    instructions: string[]
  }
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

  const { recipe, messages } = await req.json() as { recipe: RecipeSnapshot, messages: ChatMessageInput[] }
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY') ?? ''

  const recipeContext = `Title: ${recipe.title}
Ingredients:
${recipe.ingredients.map(x => `- ${x}`).join('\n')}
Instructions:
${recipe.instructions.map((x) => `- ${x}`).join('\n')}`

  const systemPrompt = `You are a helpful cooking assistant helping the user refine their recipe. The current recipe is:

${recipeContext}

Respond conversationally to the user's request. If the user asks you to modify the recipe (e.g. "make it spicier", "reduce the salt", "add a step"), apply the change and return the FULL updated recipe. Otherwise just respond with a message.

Return ONLY compact single-line JSON — no explanation, no markdown fences, no literal newlines inside string values. Use \\n within strings if you need line breaks.
ALWAYS return the full recipe in this exact format, whether or not you made changes:
{"message":"...","recipe":{"ingredients":["..."],"instructions":["..."]}}
If you made no changes, return the recipe exactly as provided above.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      system: systemPrompt,
      messages,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('Anthropic API error:', response.status, err)
    return new Response(JSON.stringify({ error: 'Failed to get AI response' }), {
      status: 500,
      headers: corsHeaders,
    })
  }

  try {
    const data = await response.json()
    const raw = (data.content[0]?.text ?? '').trim()
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    // Find the JSON object by counting brace depth (handles trailing prose / extra braces in strings)
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
    // Escape literal control chars inside JSON string values so JSON.parse doesn't choke
    const sanitized = jsonOnly.replace(/("(?:[^"\\]|\\.)*")/g, (match) =>
      match.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')
    )
    const parsed = JSON.parse(sanitized) as ChatResponse
    const result: ChatResponse = {
      message: typeof parsed.message === 'string' ? parsed.message : '',
      recipe: (parsed.recipe && Array.isArray(parsed.recipe.ingredients) && Array.isArray(parsed.recipe.instructions))
        ? { ingredients: parsed.recipe.ingredients, instructions: parsed.recipe.instructions.map(stripStepNumber) }
        : { ingredients: recipe.ingredients, instructions: recipe.instructions.map(stripStepNumber) },
    }
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('Parse error:', e)
    return new Response(JSON.stringify({ error: 'Failed to parse AI response' }), {
      status: 500,
      headers: corsHeaders,
    })
  }
})

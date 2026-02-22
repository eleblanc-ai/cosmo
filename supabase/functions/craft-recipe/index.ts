import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AiContext {
  flavor_profile: string
  highlights: string[]
  pitfalls: string[]
  notes: string
}

interface SourceInsight {
  label: string
  insights: string[]
}

interface RecipeDraft {
  ingredients: string[]
  instructions: string[]
}

interface ChatMessageInput {
  role: 'user' | 'assistant'
  content: string
}

interface CraftResponse {
  message: string
  recipe: RecipeDraft
  quick_replies?: string[]
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

  const { description, general_context, source_insights, recipe, messages, userMessage } = await req.json() as {
    description: string
    general_context: AiContext
    source_insights: SourceInsight[]
    recipe: RecipeDraft
    messages: ChatMessageInput[]
    userMessage?: string
  }

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY') ?? ''

  const contextBlock = `Dish: ${description}

Analysis of source recipes:
Flavor profile: ${general_context.flavor_profile}
${general_context.highlights.length > 0 ? `Highlights: ${general_context.highlights.join('; ')}` : ''}
${general_context.pitfalls.length > 0 ? `Pitfalls to avoid: ${general_context.pitfalls.join('; ')}` : ''}
${general_context.notes ? `Notes: ${general_context.notes}` : ''}
${source_insights.map(s => `${s.label}: ${s.insights.join('; ')}`).join('\n')}

Current recipe draft:
Ingredients:
${recipe.ingredients.map(x => `- ${x}`).join('\n')}
Instructions:
${recipe.instructions.map(x => `- ${x}`).join('\n')}`

  const isFirstCall = messages.length === 0 && !userMessage

  const systemPrompt = `You are a culinary assistant helping a user craft their own ${description} recipe. You have context about the source recipes and the current draft.

${contextBlock}

${isFirstCall
    ? `Ask a single focused opening question to help personalize this recipe. Good topics: heat/spice level, key flavor intensity, dietary restrictions, available equipment, serving size, or texture preferences. Offer 2–4 quick-reply options that would be typical choices for this dish. Do not modify the recipe yet.`
    : `Respond to the user's input. If they stated a preference that warrants a recipe change (e.g. "very spicy", "no dairy"), apply it. Then ask ONE follow-up preference question relevant to this dish and offer 2–4 quick-reply options. Do NOT include step numbers in the instructions array.`
  }

Return ONLY compact single-line JSON with no explanation, no markdown fences, no literal newlines inside string values:
{"message":"...","recipe":{"ingredients":["..."],"instructions":["..."]},"quick_replies":["option 1","option 2"]}
If you made no recipe changes, return the current recipe exactly as provided. The quick_replies field should be absent or an empty array if no follow-up question is asked.`

  const apiMessages: ChatMessageInput[] = [...messages]
  if (userMessage) {
    apiMessages.push({ role: 'user', content: userMessage })
  }
  // On first call with no messages, use a synthetic trigger
  if (apiMessages.length === 0) {
    apiMessages.push({ role: 'user', content: 'Please begin.' })
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
      system: systemPrompt,
      messages: apiMessages,
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

    const parsed = JSON.parse(sanitized) as CraftResponse
    const result: CraftResponse = {
      message: typeof parsed.message === 'string' ? parsed.message : '',
      recipe: (parsed.recipe && Array.isArray(parsed.recipe.ingredients) && Array.isArray(parsed.recipe.instructions))
        ? {
            ingredients: parsed.recipe.ingredients,
            instructions: parsed.recipe.instructions.map(stripStepNumber),
          }
        : { ingredients: recipe.ingredients, instructions: recipe.instructions },
    }
    if (Array.isArray(parsed.quick_replies) && parsed.quick_replies.length > 0) {
      result.quick_replies = parsed.quick_replies.filter((r): r is string => typeof r === 'string')
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

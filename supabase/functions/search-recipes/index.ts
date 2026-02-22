import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BraveResult {
  title: string
  url: string
  description?: string
}

interface BraveResponse {
  web?: {
    results?: BraveResult[]
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

  const { description } = await req.json() as { description: string }

  const apiKey = Deno.env.get('BRAVE_SEARCH_API_KEY') ?? ''
  const query = encodeURIComponent(`${description} recipe`)

  try {
    const res = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${query}&count=8`,
      {
        headers: { 'X-Subscription-Token': apiKey },
        signal: AbortSignal.timeout(10_000),
      },
    )

    if (!res.ok) {
      console.error('Brave API error:', res.status)
      return new Response(JSON.stringify({ results: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const data = await res.json() as BraveResponse
    const raw = data.web?.results ?? []
    const results = raw.map((r) => ({
      title: r.title,
      url: r.url,
      snippet: r.description ?? '',
    }))

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('Search error:', e)
    return new Response(JSON.stringify({ results: [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

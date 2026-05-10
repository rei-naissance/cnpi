export const config = { runtime: 'edge' }

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>
    }
  }>
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'AI features not configured — set GEMINI_API_KEY' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const body = await request.json() as { url: string }
  const { url } = body

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Generate a short, descriptive title (max 6 words) for this URL: ${url}\n\nReply with ONLY the title. No quotes. No punctuation at the end.`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 32,
          temperature: 0.4,
        },
      }),
    }
  )

  if (!response.ok) {
    return new Response(JSON.stringify({ error: 'Gemini API error' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const data = await response.json() as GeminiResponse
  const title = data.candidates[0]?.content.parts[0]?.text?.trim() ?? ''

  return new Response(JSON.stringify({ title }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

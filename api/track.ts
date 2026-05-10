import { createClient } from '@supabase/supabase-js'

export const config = { runtime: 'edge' }

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return new Response('Server configuration error', { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const body = await request.json() as { id: number; device: string }
  const { id, device } = body

  // Vercel injects these headers on the edge network — no external geolocation service needed.
  const rawCity = request.headers.get('x-vercel-ip-city')
  const city = rawCity ? decodeURIComponent(rawCity) : null
  const country = request.headers.get('x-vercel-ip-country') ?? null

  await supabase.from('clicks').insert({
    url_id: id,
    city,
    country,
    device: device ?? 'unknown',
  })

  return new Response('OK', { status: 200 })
}

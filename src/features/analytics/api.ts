import supabase from '@/shared/lib/supabase'
import { UAParser } from 'ua-parser-js'
import type { Click } from '@/types'

const parser = new UAParser()

export async function getClicks(urlIds: number[]): Promise<Click[]> {
  const { data, error } = await supabase
    .from('clicks')
    .select('*')
    .in('url_id', urlIds)

  if (error) throw new Error('Unable to load clicks')
  return (data ?? []) as Click[]
}

export async function getClicksForUrl(url_id: string): Promise<Click[]> {
  const { data, error } = await supabase
    .from('clicks')
    .select('*')
    .eq('url_id', url_id)

  if (error) throw new Error('Unable to load clicks')
  return (data ?? []) as Click[]
}

export function storeClicks({ id, originalUrl }: { id: number; originalUrl: string }): void {
  const res = parser.getResult()
  const device = res.device.type ?? 'desktop'

  // Fire-and-forget with keepalive so request survives page navigation.
  // Server uses Vercel IP headers — no external geolocation service needed.
  fetch('/api/track', {
    method: 'POST',
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, device }),
  }).catch(() => {
    // analytics failure is non-fatal
  })

  window.location.href = originalUrl
}

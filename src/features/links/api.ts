import supabase from '@/shared/lib/supabase'
import type { Url, CreateUrlData } from '@/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string

export async function getUrls(user_id: string): Promise<Url[]> {
  const { data, error } = await supabase
    .from('urls')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })

  if (error) throw new Error('Unable to load URLs')
  return data ?? []
}

export async function getUrl({ id, user_id }: { id: string; user_id: string }): Promise<Url> {
  const { data, error } = await supabase
    .from('urls')
    .select('*')
    .eq('id', id)
    .eq('user_id', user_id)
    .single()

  if (error) throw new Error('Short URL not found')
  return data as Url
}

export async function getLongUrl(id: string): Promise<Pick<Url, 'id' | 'original_url'>> {
  const { data, error } = await supabase
    .from('urls')
    .select('id, original_url')
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single()

  if (error) throw new Error('Error fetching short link')
  return data as Pick<Url, 'id' | 'original_url'>
}

export async function createUrl(
  { title, longUrl, customUrl, user_id }: CreateUrlData,
  qrCode: File
): Promise<Url[]> {
  const short_url = Math.random().toString(36).substring(2, 6)
  const fileName = `qr-${short_url}`

  const { error: storageError } = await supabase.storage
    .from('qrs')
    .upload(fileName, qrCode)

  if (storageError) throw new Error(storageError.message)

  const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`

  const { data, error } = await supabase
    .from('urls')
    .insert({
      title,
      original_url: longUrl,
      custom_url: customUrl || null,
      user_id,
      short_url,
      qr,
    })
    .select()

  if (error) throw new Error('Unable to create URL')
  return (data ?? []) as Url[]
}

export async function deleteUrl(id: string | number): Promise<null> {
  const { error } = await supabase.from('urls').delete().eq('id', id)
  if (error) throw new Error('Unable to delete URL')
  return null
}

export async function generateTitle(url: string): Promise<string> {
  const response = await fetch('/api/generate-title', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
  if (!response.ok) throw new Error('Failed to generate title')
  const data = await response.json() as { title: string }
  return data.title
}

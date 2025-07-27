export interface Url
{
  id: number
  created_at: string
  original_url: string
  short_url: string
  custom_url?: string  // Optional since it might be null
  user_id: string     // UUID is represented as string in TypeScript
  title: string
  qr: string
}

export interface Click {
  id: number
  created_at: string
  city?: string       // Optional fields since they might be null
  device?: string
  country?: string
  // Add url_id if you need to reference which URL this click belongs to
  url_id?: number
} 
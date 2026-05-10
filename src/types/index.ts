import type { User } from '@supabase/supabase-js'

export type { User }

export interface Url {
  id: number
  created_at: string
  original_url: string
  short_url: string
  custom_url: string | null
  user_id: string
  title: string
  qr: string
}

export interface Click {
  id: number
  created_at: string
  city: string | null
  device: string | null
  country: string | null
  url_id: number
}

export interface FormErrors {
  title?: string
  longUrl?: string
  customUrl?: string
  message?: string
}

export interface CreateUrlData {
  title: string
  longUrl: string
  customUrl: string
  user_id: string
}

import supabase from '@/shared/lib/supabase'
import type { AuthResponse, User } from '@supabase/supabase-js'

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  password: string
  profilePic?: File | null
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string

export async function login({ email, password }: LoginCredentials): Promise<AuthResponse> {
  const response = await supabase.auth.signInWithPassword({ email, password })
  if (response.error) throw new Error(response.error.message)
  return response
}

export async function loginWithGoogle(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/dashboard` },
  })
  if (error) throw new Error(error.message)
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: session, error } = await supabase.auth.getSession()
  if (!session.session) return null
  if (error) throw new Error(error.message)
  return session.session.user
}

export async function signup({ name, email, password, profilePic }: SignupData): Promise<AuthResponse> {
  let profile_pic: string | undefined

  if (profilePic) {
    const fileName = `dp-${name.split(' ').join('-')}-${Math.random()}`
    const { error: storageError } = await supabase.storage
      .from('profile-pic')
      .upload(fileName, profilePic)

    if (storageError) throw new Error(storageError.message)
    profile_pic = `${supabaseUrl}/storage/v1/object/public/profile-pic/${fileName}`
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        ...(profile_pic && { profile_pic }),
      },
    },
  })

  if (error) throw new Error(error.message)
  return { data, error }
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

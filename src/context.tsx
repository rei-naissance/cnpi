import { createContext, useContext, useEffect, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { getCurrentUser } from '@/features/auth/api'
import useFetch from '@/shared/hooks/use-fetch'

interface UrlContextType {
  user: User | null
  fetchUser: () => Promise<void>
  loading: boolean
  isAuthenticated: boolean
}

const urlContext = createContext<UrlContextType | undefined>(undefined)

const UrlProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, loading, func: fetchUser } = useFetch(getCurrentUser)

  const isAuthenticated = user?.role === 'authenticated'

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <urlContext.Provider value={{ user, fetchUser, loading, isAuthenticated }}>
      {children}
    </urlContext.Provider>
  )
}

export const urlState = () => {
  const context = useContext(urlContext)
  if (context === undefined) {
    throw new Error('urlState must be used within a UrlProvider')
  }
  return context
}

export default UrlProvider

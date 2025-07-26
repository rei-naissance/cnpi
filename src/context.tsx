import { createContext, useContext, useEffect, ReactNode } from 'react'
import { getCurrentUser } from './utils/apiAuth'
import useFetch from './hooks/use-fetch'

interface UrlContextType {
    user: any
    fetchUser: () => void
    loading: boolean
    isAuthenticated: boolean
}

const urlContext = createContext<UrlContextType | undefined>(undefined)

const urlProvider = ({children}: {children: ReactNode}) => {
    const {data: user, loading, func: fetchUser} = useFetch(getCurrentUser)

    const isAuthenticated = user?.role === "authenticated"

    useEffect(() => {
        fetchUser()
    }
    , [])
    
    return <urlContext.Provider value={{user, fetchUser, loading, isAuthenticated}}>
        {children}
    </urlContext.Provider>
}

export const urlState = () => {
    const context = useContext(urlContext)
    if (context === undefined) {
        throw new Error('urlState must be used within a urlProvider')
    }
    return context
}
export default urlProvider
import { createContext, useContext, useEffect } from 'react'
import { getCurrentUser } from './utils/apiAuth'
import useFetch from './hooks/use-fetch'

const urlContext = createContext()

const urlProvider = ({children}) => {
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
    return useContext(urlContext)
}
export default urlProvider
import supabase from './supabase'

export async function login({email, password} : any) {
    const {data, error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })
    
    if (error) {
        throw new Error(error.message)
    }
    
    return data
}

export async function getCurrentUser() {
    const {data: session, error} = await supabase.auth.getSession()

    if (!session.session) {
        return null
    }

    if (error) {
        throw new Error(error.message)
    }

    return session.session?.user
}
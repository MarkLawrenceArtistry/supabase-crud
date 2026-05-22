import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from '../services/supabase'

import { getSession } from "../services/tasksService";

// create instance, store it in a variable
const AuthContext = createContext()

// instance wrapper
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // supabase.auth.getSession().then(({data: { session } }) => {
        //     if(session && session.user) {
        //         setUser(session.user)
        //     } else {
        //         setUser(null)
        //     }

        //     setLoading(false)
        // })

        async function fetchSession() {
            const { session } = await getSession(supabase)
            if(session && session.user) {
                setUser(session.user)
            } else {
                setUser(null)
            }

            setLoading(false)
        }
        fetchSession()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log(`EVENT: ${event}`)

            if(session && session.user) {
                setUser(session.user)
            } else {
                setUser(null)
            }

            setLoading(false)
        })

        return () => subscription.unsubscribe();
    }, [])

    const value = {
        user,
        loading,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}
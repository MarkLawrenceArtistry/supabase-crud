import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from '../services/supabase'

// create instance, store it in a variable
const AuthContext = createContext()

// instance wrapper
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        
    })
}
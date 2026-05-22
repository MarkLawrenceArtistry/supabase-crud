import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../services/supabase";
import { login } from "../services/tasksService";

export default function Login() {
    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(null)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await login(credentials, supabase)

            if(response) {
                alert("Login successful")
                navigate('/dashboard')
            }
        } catch(err) {
            alert('Invalid credentials')
            console.error(err.message)
        }
    }

    return (
        <div className="login-div">
            <form onSubmit={handleSubmit} className="login-form">
                <div className="login-form-children">
                    <div className="login-form-header">
                        <h1>Login</h1>
                        <p>Log in your credentials to access the system.</p>
                    </div>
                    <div className="login-form-body">
                        <input type="text" placeholder="Email.." value={credentials.email} onChange={(e) => setCredentials({...credentials, email: e.target.value})} required />
                        <input type="password" placeholder="Password.." value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} required />
                    </div>
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    )
}
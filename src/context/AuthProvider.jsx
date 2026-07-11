import { useState, useEffect, useCallback } from "react"
import { AuthContext } from "./AuthContext"

const API_URL = 'http://localhost:8080'
const STORAGE_KEY = 'niddo_auth'

const loadUser = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) return JSON.parse(stored)
    } catch { /* ignore */ }
    return null
}

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(loadUser)

    useEffect(() => {
        if (user) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
        } else {
            localStorage.removeItem(STORAGE_KEY)
        }
    }, [user])

    const login = useCallback(async (email, password) => {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.trim(), password })
        })

        if (response.status === 401) {
            throw new Error('Email o contraseña incorrectos.')
        }

        if (!response.ok) {
            throw new Error('Error al iniciar sesión. Intente nuevamente.')
        }

        const data = await response.json()
        const userData = {
            token: data.token,
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            role: data.role
        }
        setUser(userData)
        return userData
    }, [])

    const logout = useCallback(() => {
        setUser(null)
    }, [])

    const getAuthHeaders = useCallback(() => {
        if (!user) return {}
        return { Authorization: `Bearer ${user.token}` }
    }, [user])

    const isAuthenticated = !!user
    const isAdmin = user?.role === 'ADMIN'

    return (
        <AuthContext.Provider value={{ user, login, logout, getAuthHeaders, isAuthenticated, isAdmin }}>
            {children}
        </AuthContext.Provider>
    )
}

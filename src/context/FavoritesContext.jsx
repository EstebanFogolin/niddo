/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { AuthContext } from './AuthContext'
import { API_URL } from '../config/api.js'

const STORAGE_KEY = 'niddo_favorites'

const loadLocalFavorites = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) return new Set(JSON.parse(stored))
    } catch { /* ignore */ }
    return new Set()
}

export const FavoritesContext = createContext()

export const FavoritesProvider = ({ children }) => {
    const { isAuthenticated, getAuthHeaders } = useContext(AuthContext)

    const [favorites, setFavorites] = useState(loadLocalFavorites)
    const [loading, setLoading] = useState(false)

    const syncWithBackend = useCallback(async () => {
        if (!isAuthenticated) return
        try {
            setLoading(true)
            const response = await fetch(`${API_URL}/api/favoritos`, {
                headers: getAuthHeaders()
            })
            if (response.ok) {
                const data = await response.json()
                const backendFavs = new Set(data.map(p => String(p.id)))
                setFavorites(backendFavs)
            } else {
                console.warn('[Favorites] sync failed:', response.status, await response.text().catch(() => ''))
            }
        } catch (e) {
            console.warn('[Favorites] No se pudo sincronizar favoritos con backend', e)
        } finally {
            setLoading(false)
        }
    }, [isAuthenticated, getAuthHeaders])

    useEffect(() => {
        syncWithBackend()
    }, [syncWithBackend])

    const isFavorite = useCallback((productId) => {
        return favorites.has(String(productId))
    }, [favorites])

    const toggleFavorite = useCallback(async (productId) => {
        const id = String(productId)
        const wasFavorite = favorites.has(id)

        // Optimistic update
        const newFavorites = new Set(favorites)
        if (wasFavorite) newFavorites.delete(id)
        else newFavorites.add(id)
        setFavorites(newFavorites)
        localStorage.setItem('niddo_favorites', JSON.stringify([...newFavorites]))

        if (!isAuthenticated) return !wasFavorite

        try {
            const response = await fetch(`${API_URL}/api/favoritos/toggle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify({ productoId: Number(productId) })
            })
            if (!response.ok) {
                const body = await response.text().catch(() => '')
                console.error('[Favorites] toggle failed:', response.status, body)
                throw new Error(`Error en backend: ${response.status}`)
            }
            const data = await response.json()
            if (data.agregado !== !wasFavorite) {
                // Backend disagreed, rollback
                const rollback = new Set(favorites)
                if (wasFavorite) rollback.add(id)
                else rollback.delete(id)
                setFavorites(rollback)
                localStorage.setItem('niddo_favorites', JSON.stringify([...rollback]))
            }
        } catch (e) {
            console.error('[Favorites] toggle error, rollback:', e)
            // Rollback on error
            const rollback = new Set(favorites)
            if (wasFavorite) rollback.add(id)
            else rollback.delete(id)
            setFavorites(rollback)
            localStorage.setItem('niddo_favorites', JSON.stringify([...rollback]))
        }
        return !wasFavorite
    }, [favorites, isAuthenticated, getAuthHeaders])

    return (
        <FavoritesContext.Provider value={{ favorites, loading, isFavorite, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    )
}

export const useFavorites = () => {
    const ctx = useContext(FavoritesContext)
    if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
    return ctx
}
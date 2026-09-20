const STORAGE_KEY = 'niddo_last_reservation'

export const saveLastReservation = (payload) => {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch { /* almacenamiento no disponible: la confirmación redirige a mis-reservas */ }
}

export const loadLastReservation = () => {
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY)
        if (!stored) return null
        sessionStorage.removeItem(STORAGE_KEY)
        return JSON.parse(stored)
    } catch {
        return null
    }
}

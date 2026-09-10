export const API_URL = 'http://localhost:8080'

export const resolveImageUrl = (path) => {
    if (!path) return ''
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    // Las imagenes ya vienen con ruta relativa /uploads/productos/... desde el backend
    if (path.startsWith('/uploads/')) {
        return `${API_URL}${path}`
    }
    // Fallback para compatibilidad: extraer filename y usar ruta estatica
    const filename = path.split('/').pop()
    return `${API_URL}/uploads/productos/${filename}`
}

export const reservasApi = {
    crear: (data, token) =>
        fetch(`${API_URL}/api/reservas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(data),
        }).then(async (r) => { if (!r.ok) throw new Error((await r.json()).mensaje || 'Error al crear reserva'); return r.json(); }),

    misReservas: (token) =>
        fetch(`${API_URL}/api/reservas/mis-reservas`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then(async (r) => { if (!r.ok) throw new Error('Error al cargar reservas'); return r.json(); }),

    cancelar: (reservaId, token) =>
        fetch(`${API_URL}/api/reservas/${reservaId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        }).then(async (r) => { if (!r.ok) throw new Error('Error al cancelar reserva'); }),

    disponibilidad: (productoId, desde, hasta) =>
        fetch(`${API_URL}/api/reservas/producto/${productoId}/disponibilidad?desde=${desde}&hasta=${hasta}`).then(async (r) => {
            if (!r.ok) throw new Error('Error al cargar disponibilidad');
            return r.json();
        }),
}

export const resenasApi = {
    crear: (productoId, data, token) =>
        fetch(`${API_URL}/api/resenas/productos/${productoId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(data),
        }).then(async (r) => { if (!r.ok) throw new Error((await r.json()).mensaje || 'Error'); return r.json(); }),

    listar: (productoId, page = 0, size = 10) =>
        fetch(`${API_URL}/api/resenas/productos/${productoId}?page=${page}&size=${size}`).then(async (r) => {
            if (!r.ok) throw new Error('Error al cargar reseñas');
            return r.json();
        }),

    obtenerRating: (productoId) =>
        fetch(`${API_URL}/api/resenas/productos/${productoId}/rating`).then(async (r) => {
            if (!r.ok) throw new Error('Error al cargar rating');
            return r.json();
        }),

    actualizar: (resenaId, data, token) =>
        fetch(`${API_URL}/api/resenas/${resenaId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(data),
        }).then(async (r) => { if (!r.ok) throw new Error((await r.json()).mensaje || 'Error'); return r.json(); }),

    eliminar: (resenaId, token) =>
        fetch(`${API_URL}/api/resenas/${resenaId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        }).then(async (r) => { if (!r.ok) throw new Error('Error al eliminar'); }),
}

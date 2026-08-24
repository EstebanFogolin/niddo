export const API_URL = 'http://localhost:8080'

export const resolveImageUrl = (path) => {
    if (!path) return ''
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    // Usar el nuevo endpoint del controlador de imágenes
    const filename = path.split('/').pop()
    return `${API_URL}/api/productos/image/${filename}`
}

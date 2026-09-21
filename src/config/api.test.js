import { describe, it, expect } from 'vitest'
import { API_URL, resolveImageUrl } from './api.js'

describe('resolveImageUrl', () => {
    it('ruta relativa /uploads se resuelve con API_URL', () => {
        expect(resolveImageUrl('/uploads/productos/foto.jpg'))
            .toBe(`${API_URL}/uploads/productos/foto.jpg`)
    })

    it('url absoluta http pasa sin cambios', () => {
        expect(resolveImageUrl('https://cdn.com/foto.jpg'))
            .toBe('https://cdn.com/foto.jpg')
    })

    it('path vacio devuelve vacio', () => {
        expect(resolveImageUrl('')).toBe('')
        expect(resolveImageUrl(null)).toBe('')
    })

    it('filename suelto cae al fallback de productos', () => {
        expect(resolveImageUrl('foto.jpg'))
            .toBe(`${API_URL}/uploads/productos/foto.jpg`)
    })
})

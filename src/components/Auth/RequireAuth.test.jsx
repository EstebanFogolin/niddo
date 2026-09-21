import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import RequireAuth from './RequireAuth.jsx'
import { AuthContext } from '../../context/AuthContext.jsx'

const renderProtegida = (isAuthenticated) => {
    render(
        <MemoryRouter initialEntries={['/favoritos']}>
            <AuthContext.Provider value={{ isAuthenticated }}>
                <Routes>
                    <Route path="/login" element={<p>Pagina de login</p>} />
                    <Route
                        path="/favoritos"
                        element={
                            <RequireAuth>
                                <p>Contenido protegido</p>
                            </RequireAuth>
                        }
                    />
                </Routes>
            </AuthContext.Provider>
        </MemoryRouter>
    )
}

describe('RequireAuth', () => {
    afterEach(() => {
        cleanup()
    })

    it('sin sesion redirige a /login', () => {
        renderProtegida(false)

        expect(screen.getByText('Pagina de login')).toBeInTheDocument()
        expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument()
    })

    it('con sesion renderiza el contenido', () => {
        renderProtegida(true)

        expect(screen.getByText('Contenido protegido')).toBeInTheDocument()
        expect(screen.queryByText('Pagina de login')).not.toBeInTheDocument()
    })
})

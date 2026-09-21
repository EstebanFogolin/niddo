import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import SearchBlock from './SearchBlock.jsx'
import { ProductContext } from '../../context/ProductContext.jsx'

const fetchProducts = vi.fn()
const fetchProductsWithAvailability = vi.fn()
const clearCategoryFilters = vi.fn()

const renderSearch = () => {
    render(
        <ProductContext.Provider
            value={{
                products: [{ title: 'Hotel Palermo' }],
                selectedCategoryIds: [2],
                clearCategoryFilters,
                fetchProducts,
                fetchProductsWithAvailability,
            }}
        >
            <SearchBlock />
        </ProductContext.Provider>
    )
}

describe('SearchBlock', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        cleanup()
    })

    it('renderiza titulo y boton de busqueda', () => {
        renderSearch()

        expect(screen.getByText('Buscar tu alojamiento ideal')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Realizar búsqueda' })).toBeInTheDocument()
    })

    it('submit llama a fetchProductsWithAvailability con filtros', () => {
        renderSearch()

        fireEvent.change(screen.getByLabelText('¿Qué buscás?'), { target: { value: 'Palermo' } })
        fireEvent.change(screen.getByLabelText('Check-in'), { target: { value: '2026-10-01' } })
        fireEvent.change(screen.getByLabelText('Check-out'), { target: { value: '2026-10-05' } })
        fireEvent.click(screen.getByRole('button', { name: 'Realizar búsqueda' }))

        expect(fetchProductsWithAvailability).toHaveBeenCalledWith([2], 'Palermo', '2026-10-01', '2026-10-05')
    })

    it('limpiar resetea campos y recarga productos', () => {
        renderSearch()

        fireEvent.change(screen.getByLabelText('¿Qué buscás?'), { target: { value: 'Palermo' } })
        fireEvent.click(screen.getByRole('button', { name: 'Limpiar' }))

        expect(screen.getByLabelText('¿Qué buscás?').value).toBe('')
        expect(clearCategoryFilters).toHaveBeenCalled()
        expect(fetchProducts).toHaveBeenCalled()
    })
})

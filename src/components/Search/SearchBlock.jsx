import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { ProductContext } from '../../context/ProductContext'
import { useContext } from 'react'
import './SearchBlock.css'

const SearchBlock = () => {
    const { products, selectedCategoryIds, clearCategoryFilters, fetchProducts, fetchProductsWithAvailability } = useContext(ProductContext)

    const [query, setQuery] = useState('')
    const [debouncedQuery, setDebouncedQuery] = useState('')
    const [fechaDesde, setFechaDesde] = useState('')
    const [fechaHasta, setFechaHasta] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const inputRef = useRef(null)
    const debounceRef = useRef(null)

    // Sugerencias derivadas (sin estado propio, sin efectos)
    const allProductNames = useMemo(
        () => products.map(p => p.title).filter(Boolean),
        [products]
    )

    const suggestions = useMemo(() => {
        if (!debouncedQuery) return []
        const q = debouncedQuery.toLowerCase()
        return allProductNames
            .filter(name => name.toLowerCase().includes(q))
            .slice(0, 5)
    }, [debouncedQuery, allProductNames])

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            setDebouncedQuery(query.trim())
        }, 300)
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
    }, [query])

    // Solo cargar productos iniciales (sin fechas)
    useEffect(() => {
        fetchProducts(selectedCategoryIds)
    }, [fetchProducts, selectedCategoryIds])

    const handleSuggestionClick = useCallback((name) => {
        setQuery(name)
        setShowSuggestions(false)
        inputRef.current?.blur()
    }, [])

    const handleFechaChange = useCallback((e) => {
        const { name, value } = e.target
        if (name === 'fechaDesde') setFechaDesde(value)
        else setFechaHasta(value)
    }, [])

    const handleBuscar = useCallback((e) => {
        e.preventDefault()
        setIsSearching(true)
        const term = query.trim()
        setDebouncedQuery(term)
        fetchProductsWithAvailability(selectedCategoryIds, term, fechaDesde, fechaHasta)
        
        // Scroll a recomendaciones después de un breve delay
        setTimeout(() => {
            const recomendaciones = document.getElementById('recomendaciones')
            if (recomendaciones) {
                recomendaciones.scrollIntoView({ behavior: 'smooth' })
            }
            setIsSearching(false)
        }, 300)
    }, [fetchProductsWithAvailability, selectedCategoryIds, query, fechaDesde, fechaHasta])

    const handleLimpiar = useCallback(() => {
        setQuery('')
        setFechaDesde('')
        setFechaHasta('')
        setDebouncedQuery('')
        clearCategoryFilters()
        setShowSuggestions(false)
        // Recargar productos sin filtros de fecha
        fetchProducts(selectedCategoryIds)
    }, [clearCategoryFilters, fetchProducts, selectedCategoryIds])

    const today = new Date().toISOString().split('T')[0]

    return (
        <section className="search-block">
            <div className="search-header">
                <h2 className="search-title">Buscar tu alojamiento ideal</h2>
                <p className="search-description">
                    Encontrá el lugar perfecto para tu próximo viaje. Filtrá por nombre, fechas y categoría.
                </p>
            </div>

            <form className="search-form" onSubmit={handleBuscar}>
                <div className="search-row">
                    <div className="search-field search-field-main">
                        <label htmlFor="search-query" className="search-label">¿Qué buscás?</label>
                        <div className="search-input-wrapper">
                            <input
                                ref={inputRef}
                                id="search-query"
                                type="text"
                                className="search-input"
                                placeholder="Ej: Hotel con pileta en Palermo"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                                autoComplete="off"
                            />
                            {showSuggestions && suggestions.length > 0 && (
                                <ul className="search-suggestions">
                                    {suggestions.map((s, i) => (
                                        <li key={i} onClick={() => handleSuggestionClick(s)}>
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="search-field">
                        <label htmlFor="fecha-desde" className="search-label">Check-in</label>
                        <input
                            id="fecha-desde"
                            type="date"
                            className="search-input"
                            value={fechaDesde}
                            onChange={handleFechaChange}
                            min={today}
                            name="fechaDesde"
                        />
                    </div>

                    <div className="search-field">
                        <label htmlFor="fecha-hasta" className="search-label">Check-out</label>
                        <input
                            id="fecha-hasta"
                            type="date"
                            className="search-input"
                            value={fechaHasta}
                            onChange={handleFechaChange}
                            min={fechaDesde || today}
                            name="fechaHasta"
                        />
                    </div>
                </div>

                <div className="search-actions">
                    <button type="button" className="search-btn-clear" onClick={handleLimpiar}>
                        Limpiar
                    </button>
                    <button type="submit" className="search-btn-primary" disabled={isSearching}>
                        {isSearching ? 'Buscando...' : 'Realizar búsqueda'}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default SearchBlock
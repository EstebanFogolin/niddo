import { useEffect, useState, useContext, useCallback, useMemo } from "react"
import { ProductContext } from "./ProductContext"
import { AuthContext } from "./AuthContext"
import { API_URL, resolveImageUrl } from "../config/api.js"

const mapApiProductToCard = (product) => {
    const cat = product.categoria
    return {
        id: `api-${product.id}`,
        title: product.nombre,
        description: product.descripcion,
        category: cat?.titulo || 'Hotel',
        categoryId: cat?.id || null,
        categoryData: cat || null,
        stars: 5,
        score: 8,
        scoreLabel: 'Muy bueno',
        distance: '0 km del centro',
        img: resolveImageUrl(product.imagenes?.[0]),
        images: product.imagenes?.map(resolveImageUrl) || [],
        caracteristicas: product.caracteristicas || []
    }
}

function fetchJson(url, options) {
    return fetch(url, options).then(async (res) => {
        if (!res.ok) {
            const err = await res.json().catch(() => null)
            throw new Error(err?.mensaje || 'Error en la petición.')
        }
        return res.json()
    })
}

export const ProductProvider = ({ children }) => {
    const { getAuthHeaders } = useContext(AuthContext)

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState('')
    const [features, setFeatures] = useState([])
    const [featuresLoading, setFeaturesLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const [categoriesLoading, setCategoriesLoading] = useState(false)
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([])

    const doFetchProducts = useCallback(async (categoriaIds, q) => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (categoriaIds && categoriaIds.length > 0) {
                params.append('categoriaIds', categoriaIds.join(','))
            }
            if (q && q.trim()) {
                params.append('q', q.trim())
            }
            const queryString = params.toString()
            const url = `${API_URL}/api/productos${queryString ? `?${queryString}` : ''}`
            const data = await fetchJson(url)
            const apiProducts = data.map(mapApiProductToCard)
            setProducts(apiProducts)
            setApiError('')
        } catch (e) {
            setApiError(e.message || 'No se pudo conectar con el backend.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        doFetchProducts(selectedCategoryIds)
    }, [doFetchProducts, selectedCategoryIds])

    const fetchCategories = useCallback(async () => {
        try {
            setCategoriesLoading(true)
            const data = await fetchJson(`${API_URL}/api/categorias`)
            setCategories(data)
        } catch {
            console.warn('No se pudieron cargar las categorías.')
        } finally {
            setCategoriesLoading(false)
        }
    }, [])

    const createCategory = useCallback(async (titulo, descripcion, imagenUrl) => {
        const params = new URLSearchParams()
        params.append('titulo', titulo)
        params.append('descripcion', descripcion)
        params.append('imagenUrl', imagenUrl)

        const created = await fetchJson(`${API_URL}/api/categorias`, {
            method: 'POST',
            headers: { ...getAuthHeaders(), 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        })
        setCategories(prev => [...prev, created])
        return created
    }, [getAuthHeaders])

    const updateCategory = useCallback(async (id, titulo, descripcion, imagenUrl) => {
        const params = new URLSearchParams()
        if (titulo) params.append('titulo', titulo)
        if (descripcion) params.append('descripcion', descripcion)
        if (imagenUrl) params.append('imagenUrl', imagenUrl)

        const updated = await fetchJson(`${API_URL}/api/categorias/${id}`, {
            method: 'PUT',
            headers: { ...getAuthHeaders(), 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        })
        setCategories(prev => prev.map(c => c.id === id ? updated : c))
        return updated
    }, [getAuthHeaders])

    const deleteCategory = useCallback(async (id) => {
        await fetchJson(`${API_URL}/api/categorias/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        })
        setCategories(prev => prev.filter(c => c.id !== id))
    }, [getAuthHeaders])

    const toggleCategoryFilter = useCallback((id) => {
        setSelectedCategoryIds(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        )
    }, [])

    const clearCategoryFilters = useCallback(() => {
        setSelectedCategoryIds([])
    }, [])

    const fetchFeatures = useCallback(async () => {
        try {
            setFeaturesLoading(true)
            const data = await fetchJson(`${API_URL}/api/caracteristicas`)
            setFeatures(data)
        } catch {
            console.warn('No se pudieron cargar las características.')
        } finally {
            setFeaturesLoading(false)
        }
    }, [])

    const createFeature = useCallback(async (nombre, icono) => {
        const params = new URLSearchParams()
        params.append('nombre', nombre)
        params.append('icono', icono)

        const created = await fetchJson(`${API_URL}/api/caracteristicas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', ...getAuthHeaders() },
            body: params
        })
        setFeatures(prev => [...prev, created])
        return created
    }, [getAuthHeaders])

    const updateFeature = useCallback(async (id, nombre, icono) => {
        const params = new URLSearchParams()
        if (nombre) params.append('nombre', nombre)
        if (icono) params.append('icono', icono)

        const updated = await fetchJson(`${API_URL}/api/caracteristicas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', ...getAuthHeaders() },
            body: params
        })
        setFeatures(prev => prev.map(f => f.id === id ? updated : f))
        return updated
    }, [getAuthHeaders])

    const deleteFeature = useCallback(async (id) => {
        await fetchJson(`${API_URL}/api/caracteristicas/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        })
        setFeatures(prev => prev.filter(f => f.id !== id))
    }, [getAuthHeaders])

    const deleteProduct = useCallback(async (id) => {
        if (typeof id === 'string' && id.startsWith('api-')) {
            try {
                const numericId = id.replace('api-', '')
                const response = await fetch(`${API_URL}/api/productos/${numericId}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders()
                })

                if (!response.ok && response.status !== 404) {
                    console.warn('No se pudo eliminar del backend:', response.status)
                }
            } catch {
                console.warn('Backend no disponible, se elimina solo de la vista local.')
            }
        }

        setProducts(prevProducts => prevProducts.filter(p => p.id !== id))
    }, [getAuthHeaders])

    const fetchAvailability = useCallback(async (productId, desde, hasta) => {
        try {
            const response = await fetch(`${API_URL}/api/reservas/producto/${productId}/disponibilidad?desde=${desde}&hasta=${hasta}`)
            if (!response.ok) throw new Error('Error al cargar disponibilidad')
            return await response.json()
        } catch {
            console.warn('No se pudo cargar disponibilidad')
            return { fechasOcupadas: [], fechasDisponibles: [] }
        }
    }, [])

    const fetchProductById = useCallback(async (id) => {
        const numericId = String(id).replace(/^api-/, '')
        const product = await fetchJson(`${API_URL}/api/productos/${numericId}`)
        return mapApiProductToCard(product)
    }, [])

    const updateProduct = useCallback(async (id, { name, description, categoryId, imagenes, caracteristicas }) => {
        const data = new FormData()
        if (name) data.append('nombre', name)
        if (description) data.append('descripcion', description)
        if (categoryId) data.append('categoriaId', categoryId)
        if (caracteristicas && caracteristicas.length > 0) {
            caracteristicas.forEach(c => data.append('caracteristicas', c))
        }
        if (imagenes && imagenes.length > 0) {
            imagenes.forEach(img => data.append('imagenes', img))
        }

        const numericId = typeof id === 'string' && id.startsWith('api-') ? id.replace('api-', '') : id
        const updatedProduct = await fetchJson(`${API_URL}/api/productos/${numericId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: data
        })

        const mappedProduct = mapApiProductToCard(updatedProduct)
        setProducts(prevProducts => prevProducts.map(p => String(p.id) === String(id) ? mappedProduct : p))
        return mappedProduct
    }, [getAuthHeaders])

    const addProduct = useCallback(async ({ name, description, categoryId, images, caracteristicas }) => {
        const data = new FormData()
        data.append('nombre', name)
        data.append('descripcion', description)
        if (categoryId) data.append('categoriaId', categoryId)

        images.forEach((image) => {
            data.append('imagenes', image)
        })

        if (caracteristicas && caracteristicas.length > 0) {
            caracteristicas.forEach(c => data.append('caracteristicas', c))
        }

        const createdProduct = await fetchJson(`${API_URL}/api/productos`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: data
        })

        const mappedProduct = mapApiProductToCard(createdProduct)
        setProducts(prevProducts => [...prevProducts, mappedProduct])
        return mappedProduct
    }, [getAuthHeaders])

    const contextValue = useMemo(() => ({
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        loading,
        apiError,
        features,
        featuresLoading,
        fetchFeatures,
        createFeature,
        updateFeature,
        deleteFeature,
        categories,
        categoriesLoading,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        selectedCategoryIds,
        toggleCategoryFilter,
        clearCategoryFilters,
        fetchProducts: doFetchProducts,
        fetchAvailability,
        fetchProductById
    }), [
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        loading,
        apiError,
        features,
        featuresLoading,
        fetchFeatures,
        createFeature,
        updateFeature,
        deleteFeature,
        categories,
        categoriesLoading,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        selectedCategoryIds,
        toggleCategoryFilter,
        clearCategoryFilters,
        doFetchProducts,
        fetchAvailability,
        fetchProductById
    ])

    return (
        <ProductContext.Provider value={contextValue}>
            {children}
        </ProductContext.Provider>
    )
}

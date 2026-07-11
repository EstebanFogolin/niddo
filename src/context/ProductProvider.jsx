import { useEffect, useState, useContext, useCallback } from "react"
import { ProductContext } from "./ProductContext"
import { AuthContext } from "./AuthContext"

const API_URL = 'http://localhost:8080'

const resolveImageUrl = (path) => {
    if (!path) return ''
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    return `${API_URL}${path}`
}

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

    const doFetchProducts = useCallback(async (categoriaIds) => {
        try {
            setLoading(true)
            const params = categoriaIds && categoriaIds.length > 0
                ? `?categoriaIds=${categoriaIds.join(',')}`
                : ''
            const response = await fetch(`${API_URL}/api/productos${params}`)

            if (!response.ok) {
                throw new Error('No se pudieron cargar los productos.')
            }

            const data = await response.json()
            const apiProducts = data.map(mapApiProductToCard)
            setProducts(apiProducts)
            setApiError('')
        } catch {
            setApiError('No se pudo conectar con el backend.')
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
            const response = await fetch(`${API_URL}/api/categorias`)
            if (!response.ok) throw new Error('Error al cargar categorías.')
            const data = await response.json()
            setCategories(data)
        } catch {
            console.warn('No se pudieron cargar las categorías.')
        } finally {
            setCategoriesLoading(false)
        }
    }, [])

    const createCategory = async (titulo, descripcion, imagenUrl) => {
        const params = new URLSearchParams()
        params.append('titulo', titulo)
        params.append('descripcion', descripcion)
        params.append('imagenUrl', imagenUrl)

        const response = await fetch(`${API_URL}/api/categorias`, {
            method: 'POST',
            headers: { ...getAuthHeaders(), 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.mensaje || 'Error al crear la categoría.')
        }
        const created = await response.json()
        setCategories(prev => [...prev, created])
        return created
    }

    const updateCategory = async (id, titulo, descripcion, imagenUrl) => {
        const params = new URLSearchParams()
        if (titulo) params.append('titulo', titulo)
        if (descripcion) params.append('descripcion', descripcion)
        if (imagenUrl) params.append('imagenUrl', imagenUrl)

        const response = await fetch(`${API_URL}/api/categorias/${id}`, {
            method: 'PUT',
            headers: { ...getAuthHeaders(), 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.mensaje || 'Error al actualizar la categoría.')
        }
        const updated = await response.json()
        setCategories(prev => prev.map(c => c.id === id ? updated : c))
        return updated
    }

    const deleteCategory = async (id) => {
        const response = await fetch(`${API_URL}/api/categorias/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.mensaje || 'Error al eliminar la categoría.')
        }
        setCategories(prev => prev.filter(c => c.id !== id))
    }

    const toggleCategoryFilter = (id) => {
        setSelectedCategoryIds(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        )
    }

    const clearCategoryFilters = () => {
        setSelectedCategoryIds([])
    }

    const fetchFeatures = useCallback(async () => {
        try {
            setFeaturesLoading(true)
            const response = await fetch(`${API_URL}/api/caracteristicas`)
            if (!response.ok) throw new Error('Error al cargar características.')
            const data = await response.json()
            setFeatures(data)
        } catch {
            console.warn('No se pudieron cargar las características.')
        } finally {
            setFeaturesLoading(false)
        }
    }, [])

    const createFeature = async (nombre, icono) => {
        const params = new URLSearchParams()
        params.append('nombre', nombre)
        params.append('icono', icono)
        const response = await fetch(`${API_URL}/api/caracteristicas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', ...getAuthHeaders() },
            body: params
        })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.mensaje || 'Error al crear la característica.')
        }
        const created = await response.json()
        setFeatures(prev => [...prev, created])
        return created
    }

    const updateFeature = async (id, nombre, icono) => {
        const params = new URLSearchParams()
        if (nombre) params.append('nombre', nombre)
        if (icono) params.append('icono', icono)
        const response = await fetch(`${API_URL}/api/caracteristicas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', ...getAuthHeaders() },
            body: params
        })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.mensaje || 'Error al actualizar la característica.')
        }
        const updated = await response.json()
        setFeatures(prev => prev.map(f => f.id === id ? updated : f))
        return updated
    }

    const deleteFeature = async (id) => {
        const response = await fetch(`${API_URL}/api/caracteristicas/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.mensaje || 'Error al eliminar la característica.')
        }
        setFeatures(prev => prev.filter(f => f.id !== id))
    }

    const deleteProduct = async (id) => {
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
    }

    const updateProduct = async (id, { name, description, categoryId, imagenes, caracteristicas }) => {
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
        const response = await fetch(`${API_URL}/api/productos/${numericId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: data
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            throw new Error(errorData?.mensaje || 'No se pudo actualizar el producto.')
        }

        const updatedProduct = await response.json()
        const mappedProduct = mapApiProductToCard(updatedProduct)
        setProducts(prevProducts => prevProducts.map(p => String(p.id) === String(id) ? mappedProduct : p))
        return mappedProduct
    }

    const addProduct = async ({ name, description, categoryId, images, caracteristicas }) => {
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

        const response = await fetch(`${API_URL}/api/productos`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: data
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            throw new Error(errorData?.mensaje || 'No se pudo guardar el producto.')
        }

        const createdProduct = await response.json()
        const mappedProduct = mapApiProductToCard(createdProduct)
        setProducts(prevProducts => [...prevProducts, mappedProduct])
        return mappedProduct
    }

    return (
        <ProductContext.Provider value={{
            products, addProduct, updateProduct, deleteProduct, loading, apiError,
            features, featuresLoading, fetchFeatures, createFeature, updateFeature, deleteFeature,
            categories, categoriesLoading, fetchCategories, createCategory, updateCategory, deleteCategory,
            selectedCategoryIds, toggleCategoryFilter, clearCategoryFilters
        }}>
            {children}
        </ProductContext.Provider>
    )
}

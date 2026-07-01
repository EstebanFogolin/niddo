import { useEffect, useState } from "react"
import initialProducts from '../data/Recommendations'
import { ProductContext } from "./ProductContext"

const API_URL = 'http://localhost:8080'

const mapApiProductToCard = (product) => ({
    id: `api-${product.id}`,
    title: product.nombre,
    description: product.descripcion,
    category: product.categoria || 'Hotel',
    stars: 5,
    score: 8,
    scoreLabel: 'Muy bueno',
    distance: '0 km del centro',
    img: product.imagenes?.[0] ? `${API_URL}${product.imagenes[0]}` : '',
    images: product.imagenes?.map((image) => `${API_URL}${image}`) || []
})

export const ProductProvider = ({ children }) => {

    const [products, setProducts] = useState(initialProducts)
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState('')

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                const response = await fetch(`${API_URL}/api/productos`)

                if (!response.ok) {
                    throw new Error('No se pudieron cargar los productos.')
                }

                const data = await response.json()
                const apiProducts = data.map(mapApiProductToCard)
                setProducts([...initialProducts, ...apiProducts])
                setApiError('')
            } catch {
                setApiError('No se pudo conectar con el backend. Se muestran productos de ejemplo.')
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    const deleteProduct = async (id) => {
        if (typeof id === 'string' && id.startsWith('api-')) {
            try {
                const numericId = id.replace('api-', '')
                const response = await fetch(`${API_URL}/api/productos/${numericId}`, {
                    method: 'DELETE'
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

    const addProduct = async ({ name, description, images }) => {
        const data = new FormData()
        data.append('nombre', name)
        data.append('descripcion', description)
        data.append('categoria', 'Hotel')

        images.forEach((image) => {
            data.append('imagenes', image)
        })

        const response = await fetch(`${API_URL}/api/productos`, {
            method: 'POST',
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
        <ProductContext.Provider value={{ products, addProduct, deleteProduct, loading, apiError }}>
            {children}
        </ProductContext.Provider>
    )
}

import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../Header/Header'
import { Footer } from '../Footer/Footer'
import { AuthContext } from '../../context/AuthContext'
import { useFavorites } from '../../context/FavoritesContext'
import ProductCard from '../RecomendCards/ProductCard'
import './FavoritesPage.css'

const FavoritesPage = () => {
    const { isAuthenticated, getAuthHeaders } = useContext(AuthContext)
    const { toggleFavorite } = useFavorites()
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!isAuthenticated) return
            try {
                setLoading(true)
                const response = await fetch('http://localhost:8080/api/favoritos', { headers: getAuthHeaders() })
                if (!response.ok) {
                    const apiError = await response.json().catch(() => null)
                    throw new Error(apiError?.mensaje || 'Error al cargar favoritos')
                }
                const data = await response.json()
                const mapped = data.map(p => ({
                    id: `api-${p.id}`,
                    title: p.nombre,
                    category: p.categoria?.titulo || 'Hotel',
                    stars: 5,
                    score: 8,
                    scoreLabel: 'Muy bueno',
                    distance: '0 km del centro',
                    img: p.imagenes?.[0] ? `http://localhost:8080${p.imagenes[0]}` : '',
                    images: p.imagenes?.map(img => `http://localhost:8080${img}`) || []
                }))
                setProducts(mapped)
            } catch {
                setError('No se pudieron cargar tus favoritos')
            } finally {
                setLoading(false)
            }
        }
        fetchFavorites()
    }, [getAuthHeaders, isAuthenticated])

    if (!isAuthenticated) {
        return (
            <>
                <Header />
                <main className="favorites-page">
                    <div className="favorites-empty-state">
                        <h2>Inicia sesión para ver tus favoritos</h2>
                        <p>Guarda tus alojamientos favoritos y accede a ellos desde cualquier dispositivo.</p>
                        <button className="btn-primary" onClick={() => navigate('/login')}>
                            Iniciar sesión
                        </button>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />
            <main className="favorites-page">
                <div className="favorites-header">
                    <h1 className="favorites-title">Mis favoritos</h1>
                    {products.length > 0 && (
                        <p className="favorites-count">{products.length} alojamiento{products.length !== 1 ? 's' : ''} guardado{products.length !== 1 ? 's' : ''}</p>
                    )}
                </div>

                {loading && <div className="favorites-loading">Cargando tus favoritos...</div>}

                {error && <div className="favorites-error">{error}</div>}

                {!loading && products.length === 0 && (
                    <div className="favorites-empty-state">
                        <div className="empty-icon">♡</div>
                        <h2>No tenés favoritos aún</h2>
                        <p>Explorá nuestros alojamientos y marcá tus favoritos con el corazón para verlos aquí.</p>
                        <button className="btn-primary" onClick={() => navigate('/')}>
                            Explorar alojamientos
                        </button>
                    </div>
                )}

                {!loading && products.length > 0 && (
                    <div className="favorites-grid">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                title={product.title}
                                category={product.category}
                                stars={product.stars}
                                score={product.score}
                                scoreLabel={product.scoreLabel}
                                distance={product.distance}
                                img={product.img}
                                onFavoriteToggle={() => toggleFavorite(product.id.replace('api-', ''))}
                                isFavorite={true}
                                showFavoriteButton={true}
                            />
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </>
    )
}

export default FavoritesPage

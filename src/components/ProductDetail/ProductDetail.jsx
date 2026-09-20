import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '../Header/Header'
import { Footer } from '../Footer/Footer'
import { ProductContext } from '../../context/ProductContext'
import AvailabilityCalendar from '../AvailabilityCalendar/AvailabilityCalendar'
import ProductPolicies from '../ProductPolicies/ProductPolicies'
import ShareModal from '../ShareModal/ShareModal'
import RatingSummary from '../Reviews/RatingSummary'
import ReviewList from '../Reviews/ReviewList'
import ReviewForm from '../Reviews/ReviewForm'
import './ProductDetail.css'

const ProductDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { products, fetchProductById } = useContext(ProductContext)
    const [isGalleryOpen, setIsGalleryOpen] = useState(false)
    const [isShareOpen, setIsShareOpen] = useState(false)
    const [remoteProduct, setRemoteProduct] = useState(null)
    const [failedProductId, setFailedProductId] = useState(null)
    const [reviews, setReviews] = useState([])
    const [totalReviews, setTotalReviews] = useState(0)
    const [editingReview, setEditingReview] = useState(null)

    const productFromList = products.find((item) => String(item.id) === id)
    const product = productFromList || (String(remoteProduct?.id) === id ? remoteProduct : null)
    const loadingProduct = !product && failedProductId !== id

    useEffect(function loadProductFromApi() {
        let cancelled = false

        if (productFromList || String(remoteProduct?.id) === id || failedProductId === id) {
            return undefined
        }

        fetchProductById(id)
            .then((fetchedProduct) => {
                if (!cancelled) setRemoteProduct(fetchedProduct)
            })
            .catch(() => {
                if (!cancelled) setFailedProductId(id)
            })

        return function cancelProductLoad() {
            cancelled = true
        }
    }, [failedProductId, fetchProductById, id, productFromList, remoteProduct])
    const productImages = product?.images?.length ? product.images : [product?.img]
    const availableImages = productImages.filter(Boolean)
    const visibleImages = availableImages.slice(0, 5)
    const extraImagesCount = Math.max(availableImages.length - visibleImages.length, 0)

    const numericId = product?.id?.replace?.('api-', '') || id.replace('api-', '')

    const handleReviewSaved = (savedReview) => {
        if (savedReview) {
            setReviews((prev) => {
                const existing = prev.findIndex((r) => r.id === savedReview.id)
                if (existing >= 0) {
                    return prev.map((r, i) => (i === existing ? savedReview : r))
                }
                return [savedReview, ...prev]
            })
            setTotalReviews((prev) => prev + 1)
        }
        setEditingReview(null)
    }

    // Scroll to top when product loads
    useEffect(() => {
        if (product) {
            window.scrollTo(0, 0)
        }
    }, [product])

    if (!product) {
        return (
            <>
                <Header />
                <main className="product-detail-page">
                    <header className="product-detail-header">
                        <h1>{loadingProduct ? 'Cargando producto...' : 'Producto no encontrado'}</h1>
                        <button className="product-detail-back" onClick={() => navigate('/')}>←</button>
                    </header>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />
            <main className="product-detail-page">
                <header className="product-detail-header">
                    <div>
                        <span className="product-detail-category">{product.category}</span>
                        <h1>{product.title}</h1>
                    </div>
                    <div className="product-detail-actions">
                        <button
                            className="product-detail-share"
                            onClick={() => setIsShareOpen(true)}
                            aria-label="Compartir producto"
                            type="button"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                <polyline points="16 6 12 2 8 6"></polyline>
                                <line x1="12" y1="2" x2="12" y2="15"></line>
                            </svg>
                        </button>
                        <a
                            href="/mis-reservas"
                            className="product-detail-reservations"
                            aria-label="Tus reservas"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span className="reservations-label">Tus reservas</span>
                        </a>
                        <button className="product-detail-back" onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')} aria-label="Volver atras">
                            ←
                        </button>
                    </div>
                </header>

                <section className="product-detail-body">
                    <div className="product-detail-gallery">
                        {visibleImages.map((image, index) => (
                            <button
                                key={`${product.id}-${image}`}
                                className={index === 0 ? 'gallery-main-item' : 'gallery-grid-item'}
                                onClick={() => setIsGalleryOpen(true)}
                                type="button"
                            >
                                <img src={image} alt={`${product.title} imagen ${index + 1}`} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                {index === visibleImages.length - 1 && extraImagesCount > 0 && (
                                    <span className="gallery-extra-count">Ver más</span>
                                )}
                            </button>
                        ))}
                    </div>

                    <p className="product-detail-description">{product.description}</p>

                    <section className="product-detail-reviews" aria-labelledby="reviews-heading">
                        <h2 id="reviews-heading" className="product-detail-reviews__title">Valoraciones y reseñas</h2>
                        <RatingSummary
                            promedio={product.promedioPuntuacion || 0}
                            total={product.totalResenas || 0}
                            distribucion={product.distribucionEstrellas || [0, 0, 0, 0, 0]}
                        />
                        <ReviewList
                            productoId={numericId}
                            initialReviews={reviews}
                            initialTotal={totalReviews}
                        />
                        <ReviewForm
                            productoId={numericId}
                            onReviewCreated={handleReviewSaved}
                            existingReview={editingReview}
                        />
                    </section>

                    {product.caracteristicas && product.caracteristicas.length > 0 && (
                        <section className="product-detail-features">
                            <h2>Qué ofrece este lugar</h2>
                            <div className="features-grid">
                                {product.caracteristicas.map((c, i) => (
                                    <span key={i} className="feature-tag">
                                        <i className={c.icono}></i> {c.nombre}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    <AvailabilityCalendar productId={numericId} />

                    <ProductPolicies category={product.category} />
                </section>
            </main>
            <Footer />

            {isGalleryOpen && (
                <div className="gallery-modal" role="dialog" aria-modal="true">
                    <div className="gallery-modal-header">
                        <h2>{product.title}</h2>
                        <button onClick={() => setIsGalleryOpen(false)} type="button" aria-label="Cerrar galeria">
                            ×
                        </button>
                    </div>
                    <div className="gallery-modal-grid">
                        {availableImages.map((image, index) => (
                            <img
                                key={`${product.id}-modal-${image}`}
                                src={image}
                                alt={`${product.title} galeria ${index + 1}`}
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                        ))}
                    </div>
                </div>
            )}

            <ShareModal
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                title={product.title}
                description={product.description}
                image={product.img}
                url={`${window.location.origin}/productos/${numericId}`}
            />
        </>
    )
}

export default ProductDetail

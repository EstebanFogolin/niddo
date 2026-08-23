import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '../Header/Header'
import { Footer } from '../Footer/Footer'
import { ProductContext } from '../../context/ProductContext'
import AvailabilityCalendar from '../AvailabilityCalendar/AvailabilityCalendar'
import ProductPolicies from '../ProductPolicies/ProductPolicies'
import './ProductDetail.css'

const ProductDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { products, fetchProductById } = useContext(ProductContext)
    const [isGalleryOpen, setIsGalleryOpen] = useState(false)
    const [remoteProduct, setRemoteProduct] = useState(null)
    const [failedProductId, setFailedProductId] = useState(null)

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
                    <button className="product-detail-back" onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')} aria-label="Volver atras">
                        ←
                    </button>
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
        </>
    )
}

export default ProductDetail

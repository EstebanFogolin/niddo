import { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '../Header/Header'
import { Footer } from '../Footer/Footer'
import { ProductContext } from '../../context/ProductContext'
import './ProductDetail.css'

const ProductDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { products } = useContext(ProductContext)
    const [isGalleryOpen, setIsGalleryOpen] = useState(false)

    const product = products.find((item) => String(item.id) === id)
    const productImages = product?.images?.length ? product.images : [product?.img]
    const availableImages = productImages.filter(Boolean)
    const visibleImages = availableImages.slice(0, 5)
    const extraImagesCount = Math.max(availableImages.length - visibleImages.length, 0)

    if (!product) {
        return (
            <>
                <Header />
                <main className="product-detail-page">
                    <header className="product-detail-header">
                        <h1>Producto no encontrado</h1>
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
                    <button className="product-detail-back" onClick={() => navigate(-1)} aria-label="Volver atras">
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
                                <img src={image} alt={`${product.title} imagen ${index + 1}`} />
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
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default ProductDetail

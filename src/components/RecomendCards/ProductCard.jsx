import { memo, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { FavoritesContext, useFavorites } from '../../context/FavoritesContext'
import { AuthContext } from '../../context/AuthContext'
import ShareModal from '../ShareModal/ShareModal'
import StarRating from '../Reviews/StarRating'
import './ProductCard.css'

const ProductCard = ({ id, title, category, stars, score, scoreLabel, distance, img, onFavoriteToggle, isFavorite, showFavoriteButton, promedioPuntuacion, totalResenas }) => {
    const { isAuthenticated } = useContext(AuthContext)
    const { toggleFavorite, isFavorite: isFav } = useFavorites()
    const [isShareOpen, setIsShareOpen] = useState(false)

    const numericId = String(id).replace(/^api-/, '')
    const favorite = showFavoriteButton ? isFavorite ?? isFav(numericId) : false
    const productUrl = `${window.location.origin}/productos/${id}`

    const handleFavoriteClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (onFavoriteToggle) {
            onFavoriteToggle(numericId)
        } else {
            toggleFavorite(numericId)
        }
    }

    const handleShareClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsShareOpen(true)
    }

    return (
        <>
            <article className='product-card'>
                <Link to={`/productos/${id}`} className='product-card-link'>
                    <div className='product-card-media'>
                        <img src={img} alt={title} className='product-card-img' onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        {showFavoriteButton && isAuthenticated && (
                            <>
                                <button
                                    className={`favorite-btn ${favorite ? 'active' : ''}`}
                                    onClick={handleFavoriteClick}
                                    aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                                    aria-pressed={favorite}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill={favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                                    </svg>
                                </button>
                                <button
                                    className="share-btn"
                                    onClick={handleShareClick}
                                    aria-label="Compartir producto"
                                    type="button"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                        <polyline points="16 6 12 2 8 6"></polyline>
                                        <line x1="12" y1="2" x2="12" y2="15"></line>
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                    <div className='product-card-content'>
                        <div className='product-card-meta'>
                            <span className='product-card-category'>{category}</span>
                            <span className='product-card-score-badge'>
                                <span className='product-card-score-label'>{scoreLabel}</span>
                                <span className='product-card-score-number'>{score}</span>
                            </span>
                        </div>
                        <h3 className='product-card-title'>{title}</h3>
                        <div className='product-card-rating'>
                            <StarRating rating={promedioPuntuacion || stars} size="small" readOnly />
                            {totalResenas > 0 && (
                                <span className='product-card-review-count'>{totalResenas} reseñas</span>
                            )}
                        </div>
                        <p className='product-card-distance'>Ubicación: {distance}</p>
                    </div>
                </Link>
            </article>
            <ShareModal
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                title={title}
                description={category}
                image={img}
                url={productUrl}
            />
        </>
    )
}

export default memo(ProductCard)

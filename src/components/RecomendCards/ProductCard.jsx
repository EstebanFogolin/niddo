import { memo, useContext } from 'react'
import { Link } from 'react-router-dom'
import { FavoritesContext, useFavorites } from '../../context/FavoritesContext'
import { AuthContext } from '../../context/AuthContext'
import './ProductCard.css'

const ProductCard = ({ id, title, category, stars, score, scoreLabel, distance, img, onFavoriteToggle, isFavorite, showFavoriteButton }) => {
    const { isAuthenticated } = useContext(AuthContext)
    const { toggleFavorite, isFavorite: isFav } = useFavorites()

    const numericId = String(id).replace(/^api-/, '')
    const favorite = showFavoriteButton ? isFavorite ?? isFav(numericId) : false

    const handleFavoriteClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (onFavoriteToggle) {
            onFavoriteToggle(numericId)
        } else {
            toggleFavorite(numericId)
        }
    }

    return (
        <article className='product-card'>
            <Link to={`/productos/${id}`} className='product-card-link'>
                <div className='product-card-media'>
                    <img src={img} alt={title} className='product-card-img' onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    {showFavoriteButton && isAuthenticated && (
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
                    <div className='product-card-stars'>{"★".repeat(stars)}{"☆".repeat(5 - stars)}</div>
                    <p className='product-card-distance'>Ubicación: {distance}</p>
                </div>
            </Link>
        </article>
    )
}

export default memo(ProductCard)

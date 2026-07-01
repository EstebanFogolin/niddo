import { Link } from 'react-router-dom'
import './ProductCard.css'

const ProductCard = ({ id, title, category, stars, score, scoreLabel, distance, img }) => {
    return (
        <Link to={`/productos/${id}`} className='product-card-link'>
            <article className='product-card'>
                <img src={img} alt={title} className='product-card-img' />
                <div className='product-card-info'>
                    <span className='product-card-category'>{category}</span>
                    <div className='product-card-stars'>{"★".repeat(stars)}{"☆".repeat(5 - stars)}</div>
                    <h3 className='product-card-title'>{title}</h3>
                    <p className='product-card-distance'>Ubicacion: {distance}</p>
                </div>
                <div className='product-card-score'>
                    <span className="product-card-score-label">{scoreLabel}</span>
                    <span className="product-card-score-number">{score}</span>
                </div>
            </article>
        </Link>
    )
}

export default ProductCard

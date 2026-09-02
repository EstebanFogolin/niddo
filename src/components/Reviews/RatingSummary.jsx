import { useMemo } from 'react'
import StarRating from './StarRating'
import './RatingSummary.css'

const RatingSummary = ({ promedio = 0, total = 0, distribucion = [0, 0, 0, 0, 0] }) => {
    const maxCount = useMemo(() => Math.max(...distribucion, 1), [distribucion])

    const getPercentage = (count) => maxCount > 0 ? (count / maxCount) * 100 : 0

    return (
        <div className="rating-summary">
            <div className="rating-summary__main">
                <div className="rating-summary__score">
                    <span className="rating-summary__number">{promedio.toFixed(1)}</span>
                    <StarRating rating={promedio} size="large" readOnly />
                    <span className="rating-summary__count">{total} {total === 1 ? 'reseña' : 'reseñas'}</span>
                </div>
                <div className="rating-summary__bars" role="list" aria-label="Distribución de valoraciones">
                    {[5, 4, 3, 2, 1].map((stars) => {
                        const count = distribucion[stars - 1]
                        const percentage = getPercentage(count)
                        return (
                            <div key={stars} className="rating-bar" role="listitem">
                                <span className="rating-bar__label">{stars}★</span>
                                <div className="rating-bar__track" role="progressbar" aria-valuenow={count} aria-valuemin={0} aria-valuemax={maxCount} aria-label={`${stars} estrellas: ${count} reseñas`}>
                                    <div className="rating-bar__fill" style={{ width: `${percentage}%` }} />
                                </div>
                                <span className="rating-bar__count">{count}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default RatingSummary
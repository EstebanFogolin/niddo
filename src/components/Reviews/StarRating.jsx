import './StarRating.css'

const StarRating = ({ rating = 0, maxRating = 5, size = 'medium', interactive = false, onChange, readOnly = false, ariaLabel = 'Valoración' }) => {
    const stars = Array.from({ length: maxRating }, (_, i) => i + 1)
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    const handleClick = (value) => {
        if (!readOnly && !interactive) return
        onChange?.(value)
    }

    const handleKeyDown = (e, value) => {
        if (readOnly) return
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onChange?.(value)
        } else if (e.key === 'ArrowRight' && value < maxRating) {
            e.preventDefault()
            onChange?.(value + 1)
        } else if (e.key === 'ArrowLeft' && value > 1) {
            e.preventDefault()
            onChange?.(value - 1)
        }
    }

    const sizeClasses = {
        small: 'star-rating--small',
        medium: 'star-rating--medium',
        large: 'star-rating--large',
    }

    return (
        <div
            className={`star-rating ${sizeClasses[size] || ''} ${interactive ? 'star-rating--interactive' : ''}`}
            role={interactive ? 'radiogroup' : 'img'}
            aria-label={ariaLabel}
            aria-readonly={readOnly}
        >
            {stars.map((star) => {
                let fill = 'empty'
                if (star <= fullStars) fill = 'full'
                else if (star === fullStars + 1 && hasHalfStar) fill = 'half'

                return (
                    <button
                        key={star}
                        type="button"
                        className={`star-rating__star star-rating__star--${fill}`}
                        onClick={() => handleClick(star)}
                        onKeyDown={(e) => handleKeyDown(e, star)}
                        disabled={readOnly}
                        aria-label={`${star} de ${maxRating} estrellas`}
                        aria-checked={interactive && star === rating}
                        tabIndex={interactive && !readOnly ? 0 : -1}
                    >
                        <svg className="star-rating__svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {fill === 'half' && (
                            <svg className="star-rating__svg star-rating__svg--half" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        )}
                    </button>
                )
            })}
        </div>
    )
}

export default StarRating
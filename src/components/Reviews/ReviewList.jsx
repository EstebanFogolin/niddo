import { useState, useEffect, useCallback } from 'react'
import StarRating from './StarRating'
import './ReviewList.css'

const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

const ReviewList = ({ productoId, initialReviews = [], initialTotal = 0 }) => {
    const [reviews, setReviews] = useState(initialReviews)
    const [total, setTotal] = useState(initialTotal)
    const [page, setPage] = useState(0)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const size = 10

    const loadReviews = useCallback(async (pageNum = 0, append = false) => {
        setLoading(true)
        try {
            const res = await fetch(`http://localhost:8080/api/resenas/productos/${productoId}?page=${pageNum}&size=${size}`)
            if (!res.ok) throw new Error('Error al cargar reseñas')
            const data = await res.json()
            const content = data.content || []
            if (append) {
                setReviews((prev) => [...prev, ...content])
            } else {
                setReviews(content)
            }
            setTotal(data.totalElements || content.length)
            setHasMore(!data.last)
            setPage(pageNum)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [productoId])

    useEffect(() => {
        loadReviews(0, false)
    }, [productoId, loadReviews])

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            loadReviews(page + 1, true)
        }
    }

    if (reviews.length === 0 && !loading) {
        return (
            <div className="review-list review-list--empty">
                <p className="review-list__empty">Este producto aún no tiene reseñas. ¡Sé el primero en valorarlo!</p>
            </div>
        )
    }

    return (
        <div className="review-list">
            <h3 className="review-list__title">
                Reseñas ({total})
            </h3>
            <ul className="review-list__items" role="list">
                {reviews.map((review) => (
                    <li key={review.id} className="review-item">
                        <header className="review-item__header">
                            <div className="review-item__author">
                                <span className="review-item__name">
                                    {review.usuarioNombre} {review.usuarioApellido?.charAt(0)}.
                                </span>
                                <time className="review-item__date" dateTime={review.createdAt}>
                                    {formatDate(review.createdAt)}
                                </time>
                            </div>
                            <StarRating rating={review.puntuacion} size="small" readOnly />
                        </header>
                        {review.comentario && (
                            <p className="review-item__comment">{review.comentario}</p>
                        )}
                        {review.updatedAt && review.updatedAt !== review.createdAt && (
                            <p className="review-item__edited">Editada el {formatDate(review.updatedAt)}</p>
                        )}
                    </li>
                ))}
            </ul>
            {hasMore && (
                <button
                    className="review-list__load-more"
                    onClick={handleLoadMore}
                    disabled={loading}
                    type="button"
                >
                    {loading ? 'Cargando...' : 'Cargar más reseñas'}
                </button>
            )}
        </div>
    )
}

export default ReviewList
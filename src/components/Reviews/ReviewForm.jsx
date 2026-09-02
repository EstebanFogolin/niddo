import { useState, useEffect } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import StarRating from './StarRating'
import './ReviewForm.css'

const ReviewForm = ({ productoId, onReviewCreated, existingReview = null }) => {
    const { isAuthenticated, token } = useContext(AuthContext)
    const [rating, setRating] = useState(existingReview?.puntuacion || 0)
    const [comment, setComment] = useState(existingReview?.comentario || '')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [canReview, setCanReview] = useState(null)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        const checkEligibility = async () => {
            if (!isAuthenticated) {
                setCanReview(false)
                setChecking(false)
                return
            }
            try {
                const res = await fetch(`http://localhost:8080/api/resenas/productos/${productoId}/rating`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (res.ok) {
                    await res.json()
                    setCanReview(true)
                } else if (res.status === 403) {
                    setCanReview(false)
                }
            } catch {
                setCanReview(false)
            } finally {
                setChecking(false)
            }
        }
        checkEligibility()
    }, [productoId, isAuthenticated, token])

    useEffect(() => {
        if (existingReview) {
            setRating(existingReview.puntuacion)
            setComment(existingReview.comentario || '')
        }
    }, [existingReview])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!isAuthenticated) return
        if (rating === 0) {
            setError('Selecciona una puntuación')
            return
        }

        setSubmitting(true)
        setError(null)

        try {
            const url = existingReview
                ? `http://localhost:8080/api/resenas/${existingReview.id}`
                : `http://localhost:8080/api/resenas/productos/${productoId}`

            const method = existingReview ? 'PUT' : 'POST'
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ puntuacion: rating, comentario: comment.trim() }),
            })

            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err.mensaje || 'Error al guardar la reseña')
            }

            const savedReview = await res.json()
            setSuccess(true)
            setError(null)
            onReviewCreated?.(savedReview)
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="review-form review-form--login">
                <p className="review-form__login-text">
                    Inicia sesión para dejar tu valoración
                </p>
            </div>
        )
    }

    if (checking) {
        return (
            <div className="review-form review-form--checking">
                <div className="review-form__spinner" />
            </div>
        )
    }

    if (!canReview) {
        return (
            <div className="review-form review-form--not-eligible">
                <p className="review-form__not-eligible">
                    Solo puedes valorar productos de los que hayas completado una reserva.
                </p>
            </div>
        )
    }

    return (
        <form className="review-form" onSubmit={handleSubmit}>
            <h4 className="review-form__title">
                {existingReview ? 'Editar tu reseña' : 'Tu valoración'}
            </h4>

            <div className="review-form__group">
                <label className="review-form__label">Puntuación</label>
                <div className="review-form__stars">
                    <StarRating
                        rating={rating}
                        interactive
                        onChange={setRating}
                        size="large"
                        ariaLabel="Selecciona tu puntuación"
                    />
                    <span className="review-form__rating-text" aria-live="polite">
                        {rating > 0 ? `${rating} de 5 estrellas` : 'Sin valorar'}
                    </span>
                </div>
            </div>

            <div className="review-form__group">
                <label className="review-form__label" htmlFor="review-comment">
                    Comentario (opcional)
                </label>
                <textarea
                    id="review-comment"
                    className="review-form__textarea"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Comparte tu experiencia..."
                    maxLength={2000}
                />
                <span className="review-form__char-count">
                    {comment.length}/2000
                </span>
            </div>

            {error && <div className="review-form__error" role="alert">{error}</div>}
            {success && <div className="review-form__success" role="status">¡Reseña guardada correctamente!</div>}

            <div className="review-form__actions">
                <button
                    type="submit"
                    className="review-form__submit"
                    disabled={submitting || rating === 0}
                >
                    {submitting ? 'Guardando...' : (existingReview ? 'Actualizar' : 'Publicar reseña')}
                </button>
                {existingReview && (
                    <button
                        type="button"
                        className="review-form__cancel"
                        onClick={() => onReviewCreated?.(null)}
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    )
}

export default ReviewForm
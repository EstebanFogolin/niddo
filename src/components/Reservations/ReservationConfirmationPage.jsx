import { useContext, useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Header } from '../Header/Header'
import { Footer } from '../Footer/Footer'
import { AuthContext } from '../../context/AuthContext'
import { loadLastReservation } from './confirmationStorage.js'
import './ReservationConfirmationPage.css'

const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const ReservationConfirmationPage = () => {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const [confirmation] = useState(() => loadLastReservation())

    useEffect(function scrollToTopOnShow() {
        window.scrollTo(0, 0)
    }, [])

    if (!confirmation) {
        return <Navigate to="/mis-reservas" replace />
    }

    const { reserva, product } = confirmation
    const guestName = [user?.nombre, user?.apellido].filter(Boolean).join(' ')

    return (
        <>
            <Header />
            <main className="confirmation-page">
                <div className="confirmation-pass">
                    <div className="confirmation-seal" aria-hidden="true">
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline className="seal-check" points="4.5 12.5 9.5 17.5 19.5 6.5"></polyline>
                        </svg>
                    </div>
                    <p className="confirmation-eyebrow">Niddo · Reserva confirmada</p>
                    <h1 className="confirmation-title">¡Listo! Tu lugar te espera</h1>
                    <p className="confirmation-subtitle">
                        {product?.title || reserva.productoNombre}
                        {product?.category ? ` · ${product.category}` : ''}
                    </p>

                    <div className="confirmation-perforation" aria-hidden="true"></div>

                    <dl className="confirmation-stub">
                        <div className="confirmation-field">
                            <dt>Check-in</dt>
                            <dd>{formatDate(reserva.fechaInicio)}</dd>
                        </div>
                        <div className="confirmation-field">
                            <dt>Check-out</dt>
                            <dd>{formatDate(reserva.fechaFin)}</dd>
                        </div>
                        <div className="confirmation-field">
                            <dt>Huésped</dt>
                            <dd>{guestName || '—'}</dd>
                        </div>
                        <div className="confirmation-field">
                            <dt>Email</dt>
                            <dd className="confirmation-email">{user?.email || '—'}</dd>
                        </div>
                        <div className="confirmation-field">
                            <dt>N.º de reserva</dt>
                            <dd>#{reserva.id}</dd>
                        </div>
                        <div className="confirmation-field">
                            <dt>Estado</dt>
                            <dd>
                                <span className="reservation-status status-pendiente">
                                    {reserva.estado}
                                </span>
                            </dd>
                        </div>
                    </dl>

                    <div className="confirmation-actions">
                        <button className="btn-primary" onClick={() => navigate('/mis-reservas')}>
                            Ver mis reservas
                        </button>
                        <button className="btn-secondary" onClick={() => navigate('/')}>
                            Seguir explorando
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default ReservationConfirmationPage

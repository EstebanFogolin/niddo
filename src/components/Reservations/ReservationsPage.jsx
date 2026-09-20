import { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Header } from '../Header/Header'
import { Footer } from '../Footer/Footer'
import { AuthContext } from '../../context/AuthContext'
import { ProductContext } from '../../context/ProductContext'
import { reservasApi, resolveImageUrl } from '../../config/api.js'
import { saveLastReservation } from './confirmationStorage.js'
import './ReservationsPage.css'

const ReservationsPage = () => {
    const { isAuthenticated, getAuthHeaders, user } = useContext(AuthContext)
    const { fetchProductById } = useContext(ProductContext)
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [confirming, setConfirming] = useState(false)
    const [confirmError, setConfirmError] = useState(null)
    const [pendingProduct, setPendingProduct] = useState(null)
    const [pendingProductLoading, setPendingProductLoading] = useState(false)
    const [expandedIds, setExpandedIds] = useState(() => new Set())
    const [productDetails, setProductDetails] = useState({})
    const [detailsLoading, setDetailsLoading] = useState({})
    const [activeTab, setActiveTab] = useState('reservas')

    // Parse URL params for pending reservation
    const productId = searchParams.get('productId')
    const checkIn = searchParams.get('checkIn')
    const checkOut = searchParams.get('checkOut')
    const hasPendingParams = productId && checkIn && checkOut

    // Start at the top whenever this page is shown (e.g. redirected after picking dates)
    useEffect(function scrollToTopOnShow() {
        window.scrollTo(0, 0)
    }, [productId, checkIn, checkOut])

    // Fetch existing reservations
    useEffect(function fetchReservationsOnAuthChange() {
        const fetchReservations = async () => {
            if (!isAuthenticated) return
            try {
                setLoading(true)
                const data = await reservasApi.misReservas(getAuthHeaders().Authorization?.replace('Bearer ', ''))
                setReservations(data)
            } catch (e) {
                console.error('[ReservationsPage] fetch failed:', e)
                setError('No se pudieron cargar tus reservas')
            } finally {
                setLoading(false)
            }
        }
        fetchReservations()
    }, [getAuthHeaders, isAuthenticated])

    // Fetch pending product details when params exist
    useEffect(function fetchPendingProductOnParamsChange() {
        if (!hasPendingParams || !isAuthenticated) return
        
        const fetchPendingProduct = async () => {
            setPendingProductLoading(true)
            try {
                const product = await fetchProductById(productId)
                setPendingProduct(product)
            } catch (e) {
                console.error('[ReservationsPage] fetch pending product failed:', e)
            } finally {
                setPendingProductLoading(false)
            }
        }
        fetchPendingProduct()
    }, [hasPendingParams, productId, fetchProductById, isAuthenticated])

    const toggleExpand = useCallback((reservation) => {
        const isExpanding = !expandedIds.has(reservation.id)
        setExpandedIds((prev) => {
            const next = new Set(prev)
            if (next.has(reservation.id)) {
                next.delete(reservation.id)
            } else {
                next.add(reservation.id)
            }
            return next
        })
        if (isExpanding && productDetails[reservation.id] === undefined && reservation.productoId) {
            setDetailsLoading((prev) => ({ ...prev, [reservation.id]: true }))
            fetchProductById(reservation.productoId)
                .then((product) => {
                    setProductDetails((prev) => ({ ...prev, [reservation.id]: product }))
                })
                .catch((e) => {
                    console.error('[ReservationsPage] fetch reservation product failed:', e)
                    setProductDetails((prev) => ({ ...prev, [reservation.id]: null }))
                })
                .finally(() => {
                    setDetailsLoading((prev) => ({ ...prev, [reservation.id]: false }))
                })
        }
    }, [expandedIds, productDetails, fetchProductById])

    const getStatusClass = (estado) => {
        switch (estado) {
            case 'CONFIRMADA': return 'status-confirmada'
            case 'PENDIENTE': return 'status-pendiente'
            case 'CANCELADA': return 'status-cancelada'
            default: return ''
        }
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }

    // Historial: confirmadas ya usadas (fecha de fin pasada), ordenadas por fecha de uso descendente
    const todayStr = new Date().toISOString().split('T')[0]
    const isPastStay = (reservation) => reservation.estado === 'CONFIRMADA' && reservation.fechaFin < todayStr
    const history = reservations
        .filter(isPastStay)
        .sort((a, b) => (a.fechaInicio < b.fechaInicio ? 1 : -1))
    const current = reservations.filter((reservation) => !isPastStay(reservation))

    const mapConfirmError = (message) => {
        const msg = message || ''
        if (/no esta disponible en esas fechas/i.test(msg)) {
            return {
                title: 'Esas fechas ya están ocupadas',
                detail: 'Otro huésped las reservó mientras elegías. Volvé al producto y probá con otro periodo.',
                action: 'product'
            }
        }
        if (/anterior a la de fin/i.test(msg)) {
            return {
                title: 'Revisá las fechas',
                detail: 'El check-in debe ser anterior al check-out. Volvé al calendario y elegí de nuevo.',
                action: 'product'
            }
        }
        if (/no puede ser pasada/i.test(msg)) {
            return {
                title: 'Esa fecha ya pasó',
                detail: 'El check-in no puede ser una fecha pasada. Elegí fechas futuras en el calendario.',
                action: 'product'
            }
        }
        if (/expirado|inválido/i.test(msg)) {
            return {
                title: 'Tu sesión expiró',
                detail: 'Volvé a iniciar sesión y repetí tu reserva.',
                action: 'login'
            }
        }
        if (/Producto no encontrado/i.test(msg)) {
            return {
                title: 'No encontramos ese alojamiento',
                detail: 'Es posible que ya no esté publicado. Explorá otras opciones.',
                action: 'home'
            }
        }
        if (/Failed to fetch|Network request failed|NetworkError/i.test(msg)) {
            return {
                title: 'Sin conexión',
                detail: 'No pudimos comunicarnos con el servidor. Revisá tu internet y reintentá.',
                action: 'retry'
            }
        }
        if (/Unexpected token|JSON|SyntaxError/i.test(msg) || !msg || msg === 'Error al crear reserva') {
            return {
                title: 'No pudimos confirmar tu reserva',
                detail: 'Ocurrió un error inesperado. Podés reintentar con tranquilidad: no se creó ningún cargo ni reserva duplicada.',
                action: 'retry'
            }
        }
        return {
            title: 'No pudimos confirmar tu reserva',
            detail: `${msg} Si el problema sigue, reintentá en unos minutos.`,
            action: 'retry'
        }
    }

    const handleConfirmReservation = async () => {
        if (!pendingProduct || !checkIn || !checkOut) return

        setConfirming(true)
        setConfirmError(null)

        try {
            const created = await reservasApi.crear(
                {
                    productoId: Number(productId),
                    fechaInicio: checkIn,
                    fechaFin: checkOut
                },
                getAuthHeaders().Authorization?.replace('Bearer ', '')
            )

            // Success: stash the created reservation and go to the confirmation page
            saveLastReservation({ reserva: created, product: pendingProduct })
            setSearchParams({}, { replace: true })
            setPendingProduct(null)
            navigate('/reserva-confirmada')

        } catch (e) {
            console.error('[ReservationsPage] confirm reservation failed:', e)
            setConfirmError(mapConfirmError(e.message))
        } finally {
            setConfirming(false)
        }
    }

    const handleConfirmErrorAction = () => {
        if (!confirmError) return
        if (confirmError.action === 'product') {
            navigate(`/productos/${productId}`)
        } else if (confirmError.action === 'login') {
            navigate('/login')
        } else if (confirmError.action === 'home') {
            navigate('/')
        } else {
            handleConfirmReservation()
        }
    }

    const getConfirmErrorActionLabel = () => {
        if (!confirmError) return ''
        if (confirmError.action === 'product') return 'Volver al producto'
        if (confirmError.action === 'login') return 'Iniciar sesión'
        if (confirmError.action === 'home') return 'Explorar alojamientos'
        return 'Reintentar'
    }

    const renderStatusBadge = (reservation, isHistory) => {
        if (isHistory) {
            return <span className="reservation-status status-finalizada">Finalizada</span>
        }
        return (
            <span className={`reservation-status ${getStatusClass(reservation.estado)}`}>
                {reservation.estado}
            </span>
        )
    }

    const renderReservationCard = (reservation, isHistory) => {
        const isExpanded = expandedIds.has(reservation.id)
        const details = productDetails[reservation.id]
        const isLoadingDetails = detailsLoading[reservation.id]
        const categoryLabel = reservation.productoCategoria || details?.category || ''
        const detailImages = details?.images?.length
            ? details.images
            : [resolveImageUrl(reservation.productoImagen)]
        return (
            <article key={reservation.id} className={`reservation-card${isExpanded ? ' reservation-card-expanded' : ''}`}>
                <button
                    type="button"
                    className="reservation-summary"
                    onClick={() => toggleExpand(reservation)}
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? 'Ocultar' : 'Ver'} detalles de ${reservation.productoNombre}`}
                >
                    <span className="reservation-main">
                        <span className="reservation-product">
                            <img
                                src={resolveImageUrl(reservation.productoImagen)}
                                alt={reservation.productoNombre}
                                className="reservation-image"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                            <span className="reservation-info">
                                <span className="reservation-product-name">{reservation.productoNombre}</span>
                                {categoryLabel ? (
                                    <span className="reservation-category">{categoryLabel}</span>
                                ) : null}
                                <span className="reservation-dates">
                                    <span className="date-icon">📅</span>
                                    <span>Check-in: {formatDate(reservation.fechaInicio)}</span>
                                    <span className="date-separator">·</span>
                                    <span>Check-out: {formatDate(reservation.fechaFin)}</span>
                                </span>
                                {isHistory && reservation.createdAt ? (
                                    <span className="reservation-booked">Reservado el {formatDate(reservation.createdAt)}</span>
                                ) : null}
                            </span>
                        </span>
                        {renderStatusBadge(reservation, isHistory)}
                    </span>
                    <svg className={`reservation-chevron${isExpanded ? ' reservation-chevron-open' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
                {isExpanded ? (
                    <div className="reservation-details">
                        {isLoadingDetails ? (
                            <div className="reservation-details-loading">
                                <div className="spinner-small"></div>
                                <span>Cargando detalles...</span>
                            </div>
                        ) : (
                            <>
                                <div className="reservation-details-gallery">
                                    {detailImages.filter(Boolean).slice(0, 3).map((image) => (
                                        <img
                                            key={image}
                                            src={image}
                                            alt={`${reservation.productoNombre} imagen`}
                                            className="reservation-details-image"
                                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                        />
                                    ))}
                                </div>
                                {details?.description ? (
                                    <p className="reservation-details-description">{details.description}</p>
                                ) : null}
                                {details?.caracteristicas?.length > 0 ? (
                                    <div className="reservation-details-features">
                                        {details.caracteristicas.map((c, i) => (
                                            <span key={c.id || i} className="pending-feature-tag">
                                                {c.icono ? <i className={c.icono}></i> : null} {c.nombre}
                                            </span>
                                        ))}
                                    </div>
                                ) : null}
                                <div className="reservation-details-grid">
                                    <div className="reservation-details-block">
                                        <span className="pending-user-title">Tus datos</span>
                                        <span className="pending-user-value">{user?.nombre} {user?.apellido}</span>
                                        <span className="pending-user-value pending-user-email">{user?.email}</span>
                                    </div>
                                    <div className="reservation-details-block">
                                        <span className="pending-user-title">Periodo</span>
                                        <span className="pending-user-value">Check-in: {formatDate(reservation.fechaInicio)}</span>
                                        <span className="pending-user-value">Check-out: {formatDate(reservation.fechaFin)}</span>
                                    </div>
                                    <div className="reservation-details-block">
                                        <span className="pending-user-title">Estado</span>
                                        {renderStatusBadge(reservation, isHistory)}
                                    </div>
                                </div>
                                {isHistory && reservation.productoId ? (
                                    <button
                                        type="button"
                                        className="btn-secondary btn-view-product"
                                        onClick={() => navigate(`/productos/${reservation.productoId}`)}
                                    >
                                        Ver alojamiento
                                    </button>
                                ) : null}
                            </>
                        )}
                    </div>
                ) : null}
            </article>
        )
    }

    const clearPendingReservation = () => {
        setSearchParams({}, { replace: true })
        setPendingProduct(null)
    }

    if (!isAuthenticated) {
        return (
            <>
                <Header />
                <main className="reservations-page">
                    <div className="reservations-empty-state">
                        <h2>Inicia sesión para ver tus reservas</h2>
                        <p>Accede a tu historial de reservas y gestiona tus próximas estancias.</p>
                        <button className="btn-primary" onClick={() => navigate('/login')}>
                            Iniciar sesión
                        </button>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />
            <main className="reservations-page">
                <div className="reservations-header">
                    <h1 className="reservations-title">Tus reservas</h1>
                    {reservations.length > 0 && (
                        <p className="reservations-count">{reservations.length} reserva{reservations.length !== 1 ? 's' : ''}</p>
                    )}
                    <div className="reservations-tabs" role="tablist" aria-label="Secciones de reservas">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'reservas'}
                            className={`reservations-tab${activeTab === 'reservas' ? ' reservations-tab-active' : ''}`}
                            onClick={() => setActiveTab('reservas')}
                        >
                            Mis reservas ({current.length})
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'historial'}
                            className={`reservations-tab${activeTab === 'historial' ? ' reservations-tab-active' : ''}`}
                            onClick={() => setActiveTab('historial')}
                        >
                            Historial ({history.length})
                        </button>
                    </div>
                </div>

                {loading && <div className="reservations-loading">Cargando tus reservas...</div>}

                {error && <div className="reservations-error">{error}</div>}

                {/* Pending Reservation Card */}
                {activeTab === 'reservas' && hasPendingParams && (
                    <div className="pending-reservation-card">
                        <div className="pending-reservation-badge">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <span>Reserva pendiente de confirmación</span>
                        </div>
                        
                        {pendingProductLoading ? (
                            <div className="pending-reservation-loading">
                                <div className="spinner-small"></div>
                                <span>Cargando detalles del alojamiento...</span>
                            </div>
                        ) : pendingProduct ? (
                            <div className="pending-reservation-content">
                                <div className="pending-reservation-gallery">
                                    <img
                                        src={pendingProduct.img || ''}
                                        alt={pendingProduct.title}
                                        className="pending-reservation-image"
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                    {pendingProduct.images?.length > 1 ? (
                                        <div className="pending-reservation-thumbs">
                                            {pendingProduct.images.slice(1, 4).map((image) => (
                                                <img
                                                    key={image}
                                                    src={image}
                                                    alt={`${pendingProduct.title} imagen adicional`}
                                                    className="pending-reservation-thumb"
                                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                />
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                                <div className="pending-reservation-info">
                                    <h3 className="pending-reservation-title">{pendingProduct.title}</h3>
                                    <p className="pending-reservation-category">{pendingProduct.category}</p>
                                    {pendingProduct.description ? (
                                        <p className="pending-reservation-description">{pendingProduct.description}</p>
                                    ) : null}
                                    {pendingProduct.caracteristicas?.length > 0 ? (
                                        <div className="pending-reservation-features">
                                            {pendingProduct.caracteristicas.map((c, i) => (
                                                <span key={c.id || i} className="pending-feature-tag">
                                                    {c.icono ? <i className={c.icono}></i> : null} {c.nombre}
                                                </span>
                                            ))}
                                        </div>
                                    ) : null}
                                    <div className="pending-reservation-user">
                                        <span className="pending-user-title">Tus datos</span>
                                        <span className="pending-user-value">{user?.nombre} {user?.apellido}</span>
                                        <span className="pending-user-value pending-user-email">{user?.email}</span>
                                    </div>
                                    <div className="pending-reservation-dates">
                                        <div className="pending-date">
                                            <span className="pending-date-label">Check-in</span>
                                            <span className="pending-date-value">{formatDate(checkIn)}</span>
                                        </div>
                                        <div className="pending-date-separator">→</div>
                                        <div className="pending-date">
                                            <span className="pending-date-label">Check-out</span>
                                            <span className="pending-date-value">{formatDate(checkOut)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="pending-reservation-actions">
                                    {confirmError ? (
                                        <div className="confirm-error-panel" role="alert">
                                            <p className="confirm-error-title">{confirmError.title}</p>
                                            <p className="confirm-error-detail">{confirmError.detail}</p>
                                            <button
                                                className="btn-primary btn-confirm-error-action"
                                                onClick={handleConfirmErrorAction}
                                                disabled={confirming}
                                            >
                                                {getConfirmErrorActionLabel()}
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="btn-primary btn-confirm-reservation"
                                            onClick={handleConfirmReservation}
                                            disabled={confirming}
                                        >
                                            {confirming ? (
                                                <>
                                                    <svg className="spinner-small" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                                                        <path d="M12 2v10" strokeLinecap="round"></path>
                                                    </svg>
                                                    Confirmando...
                                                </>
                                            ) : (
                                                'Confirmar reserva'
                                            )}
                                        </button>
                                    )}
                                    <button
                                        className="btn-secondary btn-clear-pending"
                                        onClick={clearPendingReservation}
                                        disabled={confirming}
                                    >
                                        Descartar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="pending-reservation-error-state">
                                <p>No se pudo cargar la información del alojamiento.</p>
                                <button className="btn-secondary" onClick={clearPendingReservation}>Descartar</button>
                            </div>
                        )}
                    </div>
                )}

                {!loading && activeTab === 'reservas' && current.length === 0 && !hasPendingParams && (
                    <div className="reservations-empty-state">
                        <div className="empty-icon">📅</div>
                        <h2>No tenés reservas aún</h2>
                        <p>Cuando reserves un alojamiento, aparecerá aquí con todos los detalles.</p>
                        <button className="btn-primary" onClick={() => navigate('/')}>
                            Explorar alojamientos
                        </button>
                    </div>
                )}

                {!loading && activeTab === 'reservas' && current.length > 0 && (
                    <div className="reservations-list">
                        {current.map((reservation) => renderReservationCard(reservation, false))}
                    </div>
                )}

                {!loading && activeTab === 'historial' && history.length === 0 && (
                    <div className="reservations-empty-state">
                        <div className="empty-icon">🧳</div>
                        <h2>Todavía no tenés estadías finalizadas</h2>
                        <p>Cuando completes una estadía, aparecerá aquí tu historial con todos los detalles.</p>
                        <button className="btn-primary" onClick={() => navigate('/')}>
                            Explorar alojamientos
                        </button>
                    </div>
                )}

                {!loading && activeTab === 'historial' && history.length > 0 && (
                    <div className="reservations-list">
                        {history.map((reservation) => renderReservationCard(reservation, true))}
                    </div>
                )}
            </main>
            <Footer />
        </>
    )
}

export default ReservationsPage
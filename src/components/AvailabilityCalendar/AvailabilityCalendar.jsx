import { useState, useEffect, useCallback } from 'react'
import { API_URL } from '../../config/api.js'
import './AvailabilityCalendar.css'

const AvailabilityCalendar = ({ productId, initialDesde, initialHasta }) => {
    const [fechasOcupadas, setFechasOcupadas] = useState(new Set())
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [mesActual] = useState(() => new Date())
    const [mesSiguiente] = useState(() => {
        const d = new Date()
        d.setMonth(d.getMonth() + 1)
        return d
    })

    const [desde, setDesde] = useState(initialDesde || '')
    const [hasta, setHasta] = useState(initialHasta || '')

    const fetchDisponibilidad = useCallback(async () => {
        if (!productId) return
        try {
            setLoading(true)
            setError('')
            const hoy = new Date()
            const dentroDe6Meses = new Date()
            dentroDe6Meses.setMonth(dentroDe6Meses.getMonth() + 6)
            const desdeStr = hoy.toISOString().split('T')[0]
            const hastaStr = dentroDe6Meses.toISOString().split('T')[0]

            const response = await fetch(`${API_URL}/api/reservas/producto/${productId}/disponibilidad?desde=${desdeStr}&hasta=${hastaStr}`)
            if (!response.ok) throw new Error('Error al cargar disponibilidad')
            const data = await response.json()

            setFechasOcupadas(new Set(data.fechasOcupadas || []))
        } catch {
            setError('No se pudo obtener la disponibilidad. Intente más tarde.')
        } finally {
            setLoading(false)
        }
    }, [productId])

    useEffect(() => {
        fetchDisponibilidad()
    }, [fetchDisponibilidad])

    const diasDelMes = (mes) => {
        const año = mes.getFullYear()
        const mesIdx = mes.getMonth()
        const primerDia = new Date(año, mesIdx, 1)
        const ultimoDia = new Date(año, mesIdx + 1, 0)
        const diasEnMes = ultimoDia.getDate()
        const primerDiaSemana = primerDia.getDay()

        const dias = []
        for (let i = 0; i < primerDiaSemana; i++) {
            dias.push(null)
        }
        for (let d = 1; d <= diasEnMes; d++) {
            dias.push(new Date(año, mesIdx, d))
        }
        return dias
    }

    const renderCalendario = (mes, label) => {
        const dias = diasDelMes(mes)
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)

        return (
            <div className="calendario-mes">
                <h4 className="calendario-titulo">{label}</h4>
                <div className="calendario-grid">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                        <div key={d} className="calendario-dia-header">{d}</div>
                    ))}
                    {dias.map((dia, idx) => (
                        <button
                            key={idx}
                            className={`calendario-dia ${getDiaClass(dia)}`}
                            onClick={() => handleDiaClick(dia)}
                            disabled={!dia || dia < new Date() || fechasOcupadas.has(dia.toISOString().split('T')[0])}
                        >
                            {dia && dia.getDate()}
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    const getDiaClass = (dia) => {
        if (!dia) return 'vacio'
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)
        const fechaStr = dia.toISOString().split('T')[0]

        const clases = []
        if (dia < new Date()) clases.push('pasado')
        if (fechasOcupadas.has(fechaStr)) clases.push('ocupado')
        else if (fechaStr >= new Date().toISOString().split('T')[0]) clases.push('disponible')
        if (desde && hasta && fechaStr >= desde && fechaStr <= hasta) clases.push('seleccionado')
        if (desde && fechaStr === desde) clases.push('inicio-rango')
        if (hasta && fechaStr === hasta) clases.push('fin-rango')
        return clases.join(' ')
    }

    const handleDiaClick = useCallback((dia) => {
        if (!dia) return
        if (dia < new Date()) return

        const fechaStr = dia.toISOString().split('T')[0]
        if (fechasOcupadas.has(fechaStr)) return

        if (!desde || (desde && hasta)) {
            setDesde(fechaStr)
            setHasta('')
        } else if (fechaStr < desde) {
            setHasta(desde)
            setDesde(fechaStr)
        } else {
            setHasta(fechaStr)
        }
    }, [desde, hasta, fechasOcupadas])

    const handleReintentar = () => {
        setError('')
        fetchDisponibilidad()
    }

    if (loading) {
        return (
            <div className="availability-calendar">
                <div className="calendario-loading">Cargando disponibilidad...</div>
            </div>
        )
    }

    return (
        <section className="availability-calendar">
            <h3 className="availability-title">Disponibilidad</h3>

            {error && (
                <div className="availability-error">
                    <p>{error}</p>
                    <button className="btn-reintentar" onClick={handleReintentar}>Reintentar</button>
                </div>
            )}

            <div className="calendarios-container">
                {renderCalendario(mesActual, mesActual.toLocaleString('es-ES', { month: 'long', year: 'numeric' }))}
                {renderCalendario(mesSiguiente, mesSiguiente.toLocaleString('es-ES', { month: 'long', year: 'numeric' }))}
            </div>

            {(desde || hasta) && (
                <div className="rango-seleccionado">
                    <strong>Seleccionado:</strong>
                    {desde && <span>Check-in: {desde}</span>}
                    {hasta && <span>Check-out: {hasta}</span>}
                    {!hasta && desde && <span className="esperando">Seleccione fecha de salida</span>}
                </div>
            )}
        </section>
    )
}

export default AvailabilityCalendar
import { useEffect, useRef, useState } from 'react'
import { WHATSAPP_NUMBER } from '../../config/api.js'
import './WhatsAppChatPanel.css'

const isValidNumber = (number) => /^\d{8,15}$/.test(number || '')

const buildChatUrl = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`

const WhatsAppChatPanel = ({ productTitle, onClose }) => {
    const isSimulation = !isValidNumber(WHATSAPP_NUMBER)
    const initialText = productTitle
        ? `Hola, consulto por ${productTitle} (Niddo)`
        : 'Hola, tengo una consulta sobre Niddo'

    const [messages, setMessages] = useState(() => [
        { id: 0, from: 'support', text: '¡Hola! ¿En qué te ayudamos?', pending: false }
    ])
    const [draft, setDraft] = useState(initialText)
    const [sending, setSending] = useState(false)
    const [notice, setNotice] = useState(null)
    const [inlineError, setInlineError] = useState('')
    const timerRef = useRef(null)
    const bottomRef = useRef(null)

    useEffect(function clearTimerOnUnmount() {
        return function clearPendingTimer() {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])

    useEffect(function closeOnEscape() {
        const handleKey = (event) => {
            if (event.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKey)
        return function removeKeyListener() {
            window.removeEventListener('keydown', handleKey)
        }
    }, [onClose])

    useEffect(function scrollToBottom() {
        bottomRef.current?.scrollIntoView({ block: 'nearest' })
    }, [messages, notice])

    const handleSend = () => {
        const text = draft.trim()
        if (!text) {
            setInlineError('Escribí un mensaje antes de enviar.')
            return
        }
        setInlineError('')
        if (typeof navigator !== 'undefined' && navigator.onLine === false) {
            setNotice({ type: 'error', text: 'Revisá tu conexión a internet e intentá de nuevo.' })
            return
        }
        const message = { id: Date.now(), from: 'me', text, pending: isSimulation }
        setMessages((prev) => [...prev, message])
        setDraft('')
        setNotice(null)

        if (isSimulation) {
            setSending(true)
            timerRef.current = setTimeout(() => {
                setSending(false)
                setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, pending: false } : m)))
                setNotice({ type: 'success', text: '¡Mensaje enviado correctamente! (simulación)' })
            }, 900)
        } else {
            const url = buildChatUrl(text)
            const opened = window.open(url, '_blank', 'noopener,noreferrer')
            if (opened) {
                setNotice({ type: 'info', text: 'Se abrió WhatsApp en una pestaña nueva para continuar el chat.' })
            } else {
                setNotice({ type: 'error', text: 'Tu navegador bloqueó la ventana.', link: url })
            }
        }
    }

    const handleInputKey = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            if (!sending) handleSend()
        }
    }

    return (
        <section className="whatsapp-panel" role="dialog" aria-label="Chat de soporte por WhatsApp">
            <header className="whatsapp-panel-header">
                <div className="whatsapp-panel-titles">
                    <strong>Soporte Niddo</strong>
                    {isSimulation ? (
                        <span className="whatsapp-sim-badge">Simulación</span>
                    ) : (
                        <span className="whatsapp-online">En línea</span>
                    )}
                </div>
                <button type="button" className="whatsapp-panel-close" onClick={onClose} aria-label="Cerrar chat">
                    ×
                </button>
            </header>

            <div className="whatsapp-panel-messages">
                {messages.map((message) => (
                    <div key={message.id} className={`whatsapp-bubble whatsapp-bubble-${message.from}`}>
                        <p>{message.text}</p>
                        {message.from === 'me' ? (
                            <span className="whatsapp-ticks" aria-label={message.pending ? 'Enviando' : 'Enviado'}>
                                {message.pending ? '…' : '✓✓'}
                            </span>
                        ) : null}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {notice ? (
                <p className={`whatsapp-panel-notice whatsapp-panel-notice-${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>
                    {notice.text}
                    {notice.link ? (
                        <a href={notice.link} target="_blank" rel="noopener noreferrer" className="whatsapp-toast-link">
                            Abrir chat
                        </a>
                    ) : null}
                </p>
            ) : null}

            <div className="whatsapp-panel-input-row">
                <input
                    type="text"
                    className="whatsapp-panel-input"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={handleInputKey}
                    placeholder="Escribí tu consulta…"
                    aria-label="Escribí tu consulta"
                    disabled={sending}
                    autoFocus
                />
                <button
                    type="button"
                    className="whatsapp-panel-send"
                    onClick={handleSend}
                    disabled={sending}
                    aria-label="Enviar mensaje"
                >
                    {sending ? (
                        <span className="spinner-small" aria-hidden="true"></span>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    )}
                </button>
            </div>
            {inlineError ? <p className="whatsapp-panel-error" role="alert">{inlineError}</p> : null}
        </section>
    )
}

export default WhatsAppChatPanel

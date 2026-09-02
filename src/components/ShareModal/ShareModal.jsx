import { useCallback, useEffect, useRef, useState } from 'react'
import './ShareModal.css'

const SOCIAL_ICONS = {
  facebook: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  twitter: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  whatsapp: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.67m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378 9.86 9.86 0 0 1-2.14-3.843 9.874 9.874 0 0 1 4.047-5.115c.075-.037.15-.057.21-.057.234 0 .412.08.567.234a10.25 10.25 0 0 1 3.36 1.125 10.17 10.17 0 0 1 2.173 3.933c.112.234.168.47.168.738 0 .522-.46 2.546-.92 2.695-.298.098-1.926.148-2.54.118z" />
    </svg>
  ),
  linkedin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  copy: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  ),
  native: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
      <polyline points="16 6 12 2 8 6"></polyline>
      <line x1="12" y1="2" x2="12" y2="15"></line>
    </svg>
  ),
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  ),
}

const truncate = (str, max = 120) => {
  if (!str) return ''
  if (str.length <= max) return str
  const truncated = str.slice(0, max).trim()
  const lastSpace = truncated.lastIndexOf(' ')
  return lastSpace > 0 ? truncated.slice(0, lastSpace) + '…' : truncated + '…'
}

const ShareModal = ({ isOpen, onClose, title, description, image, url }) => {
  const modalRef = useRef(null)
  const previousActiveElement = useRef(null)
  const [message, setMessage] = useState(() => `Mirá este lugar en Niddo: ${title} ${url}`)
  const [copyFeedback, setCopyFeedback] = useState(null)

  const trapFocus = (e) => {
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, textarea, [href], input, select, [tabindex]:not([tabindex="-1"])'
    )
    if (!focusableElements?.length) return
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault()
      lastElement.focus()
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault()
      firstElement.focus()
    }
  }

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose()
    }
    if (e.key === 'Tab') {
      trapFocus(e)
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement
      document.body.style.overflow = 'hidden'
      const focusable = modalRef.current?.querySelector('button, textarea, [href]')
      focusable?.focus()
      document.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
      previousActiveElement.current?.focus()
    }
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const buildShareUrl = (platform) => {
    const encodedUrl = encodeURIComponent(url)
    const encodedMessage = encodeURIComponent(message)
    switch (platform) {
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`
      case 'whatsapp':
        return `https://api.whatsapp.com/send?text=${encodeURIComponent(message + ' ' + url)}`
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
      default:
        return url
    }
  }

  const openShareWindow = (platform) => {
    const shareUrl = buildShareUrl(platform)
    window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopyFeedback('¡Copiado!')
      setTimeout(() => setCopyFeedback(null), 2000)
    } catch {
      setCopyFeedback('Error al copiar')
      setTimeout(() => setCopyFeedback(null), 2000)
    }
  }

  const handleCopyForInstagram = async () => {
    try {
      await navigator.clipboard.writeText(`${message} ${url}`)
      setCopyFeedback('¡Copiado! Pegalo en tu historia o publicación de Instagram')
      setTimeout(() => setCopyFeedback(null), 3000)
    } catch {
      setCopyFeedback('Error al copiar')
      setTimeout(() => setCopyFeedback(null), 2000)
    }
  }

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title,
        text: message,
        url,
      })
    } catch (_err) {
      if (_err.name !== 'AbortError') {
        console.warn('Error sharing:', _err)
      }
    }
  }
  if (!isOpen) return null

  const truncatedDescription = truncate(description)

  return (
    <div
      className="share-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      onClick={handleOverlayClick}
      ref={modalRef}
    >
      <div className="share-modal-content">
        <header className="share-modal-header">
          <h2 id="share-modal-title">Compartir</h2>
          <button
            className="share-modal-close"
            onClick={onClose}
            aria-label="Cerrar modal de compartir"
            type="button"
          >
            ×
          </button>
        </header>

        <div className="share-modal-body">
          <div className="share-preview">
            <img
              src={image}
              alt={title}
              className="share-preview-image"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="share-preview-info">
              <h3 className="share-preview-title">{title}</h3>
              <p className="share-preview-description">{truncatedDescription}</p>
              <span className="share-preview-url">{url}</span>
            </div>
          </div>

          <div className="share-message">
            <label htmlFor="share-message" className="share-message-label">
              Mensaje a compartir
            </label>
            <textarea
              id="share-message"
              className="share-message-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Escribe tu mensaje..."
            />
          </div>

          <div className="share-platforms" role="list" aria-label="Redes sociales para compartir">
            <button
              className="share-platform-btn share-platform-facebook"
              onClick={() => openShareWindow('facebook')}
              type="button"
              aria-label="Compartir en Facebook"
              role="listitem"
            >
              {SOCIAL_ICONS.facebook}
            </button>
            <button
              className="share-platform-btn share-platform-twitter"
              onClick={() => openShareWindow('twitter')}
              type="button"
              aria-label="Compartir en X (Twitter)"
              role="listitem"
            >
              {SOCIAL_ICONS.twitter}
            </button>
            <button
              className="share-platform-btn share-platform-whatsapp"
              onClick={() => openShareWindow('whatsapp')}
              type="button"
              aria-label="Compartir en WhatsApp"
              role="listitem"
            >
              {SOCIAL_ICONS.whatsapp}
            </button>
            <button
              className="share-platform-btn share-platform-linkedin"
              onClick={() => openShareWindow('linkedin')}
              type="button"
              aria-label="Compartir en LinkedIn"
              role="listitem"
            >
              {SOCIAL_ICONS.linkedin}
            </button>
            <button
              className="share-platform-btn share-platform-copy"
              onClick={handleCopyLink}
              type="button"
              aria-label="Copiar enlace al portapapeles"
              role="listitem"
            >
              {SOCIAL_ICONS.copy}
            </button>
            {navigator.share && (
              <button
                className="share-platform-btn share-platform-native"
                onClick={handleNativeShare}
                type="button"
                aria-label="Compartir usando el selector nativo del sistema"
                role="listitem"
              >
                {SOCIAL_ICONS.native}
              </button>
            )}
            <button
              className="share-platform-btn share-platform-instagram"
              onClick={handleCopyForInstagram}
              type="button"
              aria-label="Copiar para compartir en Instagram"
              role="listitem"
            >
              {SOCIAL_ICONS.instagram}
            </button>
          </div>

          {copyFeedback && (
            <div className="share-toast" role="status" aria-live="polite">
              {copyFeedback}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShareModal
import { useCallback, useEffect, useRef, useState } from 'react'
import './DeleteCategoryModal.css'

const DeleteCategoryModal = ({ isOpen, onClose, category, onConfirm, loading }) => {
  const modalRef = useRef(null)
  const previousActiveElement = useRef(null)
  const [confirmText, setConfirmText] = useState('')

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
      const focusable = modalRef.current?.querySelector('.delete-modal-cancel')
      focusable?.focus()
      document.addEventListener('keydown', handleKeyDown)
      setConfirmText('')
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

  const handleConfirm = async () => {
    if (confirmText.toUpperCase() !== 'ELIMINAR') {
      return
    }
    try {
      await onConfirm()
      onClose()
    } catch (_err) {
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="delete-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-warning"
      onClick={handleOverlayClick}
      ref={modalRef}
    >
      <div className="delete-modal-content">
        <header className="delete-modal-header">
          <h2 id="delete-modal-title">Eliminar Categoría</h2>
          <button
            className="delete-modal-close"
            onClick={onClose}
            aria-label="Cerrar modal de eliminación"
            type="button"
            disabled={loading}
          >
            ×
          </button>
        </header>

        <div className="delete-modal-body">
          <div className="delete-category-preview">
            <img
              src={category?.imagenUrl}
              alt={category?.titulo}
              className="delete-category-image"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="delete-category-info">
              <h3 className="delete-category-title">{category?.titulo}</h3>
              <p className="delete-category-description">{category?.descripcion}</p>
            </div>
          </div>

          <div
            id="delete-modal-warning"
            className="delete-modal-warning"
            role="alert"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div className="delete-modal-warning-text">
              <strong>⚠️ Esta acción eliminará <em>todos los productos</em> asociados a esta categoría.</strong>
              <p>Se borrarán permanentemente {category?.productos?.length || 0} producto(s) vinculado(s) a <strong>{category?.titulo}</strong>.</p>
              <p>Esta acción <strong>no se puede deshacer</strong>.</p>
            </div>
          </div>

          <div className="delete-modal-confirmation">
            <label htmlFor="delete-confirm-input" className="delete-confirm-label">
              Escribe <strong>ELIMINAR</strong> para confirmar:
            </label>
            <input
              id="delete-confirm-input"
              type="text"
              className="delete-confirm-input"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="ELIMINAR"
              disabled={loading}
              autoFocus
              aria-describedby="delete-modal-warning"
            />
          </div>
        </div>

        <footer className="delete-modal-footer">
          <button
            className="delete-modal-cancel"
            onClick={onClose}
            disabled={loading}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="delete-modal-confirm"
            onClick={handleConfirm}
            disabled={loading || confirmText.toUpperCase() !== 'ELIMINAR'}
            type="button"
          >
            {loading ? (
              <>
                <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                  <path d="M12 2v10" strokeLinecap="round"></path>
                </svg>
                Eliminando...
              </>
            ) : (
              'Confirmar eliminación'
            )}
          </button>
        </footer>
      </div>
    </div>
  )
}

export default DeleteCategoryModal
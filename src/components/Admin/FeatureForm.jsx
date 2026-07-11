import { useContext, useState, useEffect } from 'react'
import { ProductContext } from '../../context/ProductContext'
import './AddProductForm.css'

const FeatureForm = ({ feature, onClose }) => {
    const { createFeature, updateFeature } = useContext(ProductContext)
    const isEditing = !!feature

    const [formData, setFormData] = useState({
        nombre: '',
        icono: ''
    })

    useEffect(() => {
        if (feature) {
            setFormData({ nombre: feature.nombre || '', icono: feature.icono || '' })
        }
    }, [feature])

    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)

    const validate = () => {
        const newErrors = {}
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.'
        if (!formData.icono.trim()) newErrors.icono = 'El icono es obligatorio.'
        setErrors(newErrors)
        return !Object.values(newErrors).some(Boolean)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        try {
            setSaving(true)
            if (isEditing) {
                await updateFeature(feature.id, formData.nombre.trim(), formData.icono.trim())
            } else {
                await createFeature(formData.nombre.trim(), formData.icono.trim())
            }
            setSuccess(true)
            setTimeout(() => onClose(), 1500)
        } catch (err) {
            setErrors(prev => ({ ...prev, submit: err.message }))
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="form-overlay">
            <div className="form-container">
                <h2 className="form-title">{isEditing ? 'Editar característica' : 'Agregar característica'}</h2>

                {success && <p className="form-success">¡Característica guardada con éxito!</p>}
                {errors.submit && <p className="form-error">{errors.submit}</p>}

                <form onSubmit={handleSubmit} noValidate>
                    <div className={`form-group${errors.nombre ? ' has-error' : ''}`}>
                        <label htmlFor="feature-nombre">Nombre</label>
                        <input
                            id="feature-nombre"
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Ej: WiFi, Aire acondicionado"
                        />
                        {errors.nombre && <span className="field-error">{errors.nombre}</span>}
                    </div>

                    <div className={`form-group${errors.icono ? ' has-error' : ''}`}>
                        <label htmlFor="feature-icono">Icono (clase Bootstrap Icons)</label>
                        <input
                            id="feature-icono"
                            type="text"
                            name="icono"
                            value={formData.icono}
                            onChange={handleChange}
                            placeholder="Ej: bi-wifi, bi-snow"
                        />
                        {errors.icono && <span className="field-error">{errors.icono}</span>}
                        {formData.icono && (
                            <p className="form-hint">
                                Vista previa: <i className={formData.icono}></i>
                            </p>
                        )}
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-submit" disabled={saving}>
                            {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FeatureForm

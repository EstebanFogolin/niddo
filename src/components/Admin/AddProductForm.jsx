import { useContext, useState, useCallback, useEffect } from 'react'
import './AddProductForm.css'
import { ProductContext } from '../../context/ProductContext'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024

const AddProductForm = ({ onClose }) => {

    const { products, addProduct, features, fetchFeatures, categories, fetchCategories } = useContext(ProductContext)

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        categoryId: '',
        images: [],
        caracteristicas: [],
        contactoEmail: '',
        contactoTelefono: ''
    })

    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState(false)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchFeatures()
        fetchCategories()
    }, [fetchFeatures, fetchCategories])

    const validateField = useCallback((name, value) => {
        switch (name) {
            case 'name': {
                const trimmed = value.trim()
                if (!trimmed) return 'El nombre es obligatorio.'
                if (trimmed.length < 3) return 'El nombre debe tener al menos 3 caracteres.'
                return ''
            }
            case 'description': {
                const trimmed = value.trim()
                if (!trimmed) return 'La descripción es obligatoria.'
                if (trimmed.length < 10) return 'La descripción debe tener al menos 10 caracteres.'
                return ''
            }
            case 'categoryId': {
                if (!value) return 'Debe seleccionar una categoría.'
                return ''
            }
            case 'images': {
                if (!value || value.length === 0) return 'Debe seleccionar al menos una imagen.'
                const invalidType = value.find(f => !ALLOWED_TYPES.includes(f.type))
                if (invalidType) return 'Solo se permiten imágenes JPG, PNG o WEBP.'
                const oversized = value.find(f => f.size > MAX_FILE_SIZE)
                if (oversized) return 'Cada imagen debe pesar menos de 5 MB.'
                return ''
            }
            case 'contactoEmail': {
                const trimmed = value.trim()
                if (trimmed && !trimmed.includes('@')) return 'El email de contacto no es válido.'
                return ''
            }
            default:
                return ''
        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        const error = validateField(name, value)
        setErrors(prev => ({ ...prev, [name]: error }))
    }

    const handleImages = (e) => {
        const files = Array.from(e.target.files)
        setFormData(prev => ({ ...prev, images: files }))
        const error = validateField('images', files)
        setErrors(prev => ({ ...prev, images: error }))
    }

    const validateForm = () => {
        const newErrors = {
            name: validateField('name', formData.name),
            description: validateField('description', formData.description),
            categoryId: validateField('categoryId', formData.categoryId),
            images: validateField('images', formData.images),
            contactoEmail: validateField('contactoEmail', formData.contactoEmail)
        }
        setErrors(newErrors)
        return !Object.values(newErrors).some(Boolean)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        const exists = products.some(
            (p) => p.title.toLowerCase() === formData.name.trim().toLowerCase()
        )

        if (exists) {
            setErrors(prev => ({ ...prev, name: 'Ya existe un producto con ese nombre.' }))
            return
        }

        try {
            setSaving(true)
            await addProduct({
                ...formData,
                categoryId: formData.categoryId ? Number(formData.categoryId) : null
            })
            setSuccess(true)
            setTimeout(() => {
                onClose()
            }, 1500)
        } catch (error) {
            setErrors(prev => ({ ...prev, submit: error.message }))
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="form-overlay">
            <div className="form-container">
                <h2 className="form-title">Agregar producto</h2>

                {success && <p className="form-success">¡Producto agregado con éxito!</p>}
                {errors.submit && <p className="form-error">{errors.submit}</p>}

                <form onSubmit={handleSubmit} noValidate>
                    <div className={`form-group${errors.name ? ' has-error' : ''}`}>
                        <label htmlFor="name">Nombre</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nombre del producto"
                        />
                        {errors.name && <span className="field-error">{errors.name}</span>}
                    </div>

                    <div className={`form-group${errors.description ? ' has-error' : ''}`}>
                        <label htmlFor="description">Descripción</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Descripción del producto"
                            rows={4}
                        />
                        {errors.description && <span className="field-error">{errors.description}</span>}
                    </div>

                    <div className={`form-group${errors.categoryId ? ' has-error' : ''}`}>
                        <label htmlFor="categoryId">Categoría</label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                        >
                            <option value="">Seleccionar categoría</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.titulo}</option>
                            ))}
                        </select>
                        {errors.categoryId && <span className="field-error">{errors.categoryId}</span>}
                    </div>

                    <div className={`form-group${errors.contactoEmail ? ' has-error' : ''}`}>
                        <label htmlFor="contactoEmail">Email de contacto del proveedor (opcional)</label>
                        <input
                            id="contactoEmail"
                            type="email"
                            name="contactoEmail"
                            value={formData.contactoEmail}
                            onChange={handleChange}
                            placeholder="proveedor@ejemplo.com"
                        />
                        {errors.contactoEmail && <span className="field-error">{errors.contactoEmail}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="contactoTelefono">Teléfono de contacto del proveedor (opcional)</label>
                        <input
                            id="contactoTelefono"
                            type="tel"
                            name="contactoTelefono"
                            value={formData.contactoTelefono}
                            onChange={handleChange}
                            placeholder="+54 11 1234 5678"
                        />
                    </div>
                    <div className={`form-group${errors.images ? ' has-error' : ''}`}>
                        <label htmlFor="images">Imágenes</label>                        <input
                            id="images"
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp"
                            multiple
                            onChange={handleImages}
                        />
                        {errors.images ? (
                            <span className="field-error">{errors.images}</span>
                        ) : formData.images.length > 0 ? (
                            <p className="form-img-count">{formData.images.length} imagen(es) seleccionada(s)</p>
                        ) : null}
                        <p className="form-hint">Formatos: JPG, PNG, WEBP — Máx. 5 MB por imagen</p>
                    </div>

                    {features.length > 0 && (
                        <div className="form-group">
                            <label>Características</label>
                            <div className="feature-checkboxes">
                                {features.map(f => (
                                    <label key={f.id} className="feature-checkbox-label">
                                        <input
                                            type="checkbox"
                                            value={f.id}
                                            checked={formData.caracteristicas.includes(f.id)}
                                            onChange={(e) => {
                                                const id = Number(e.target.value)
                                                setFormData(prev => ({
                                                    ...prev,
                                                    caracteristicas: e.target.checked
                                                        ? [...prev.caracteristicas, id]
                                                        : prev.caracteristicas.filter(c => c !== id)
                                                }))
                                            }}
                                        />
                                        <i className={f.icono}></i> {f.nombre}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-submit" disabled={saving}>
                            {saving ? 'Guardando...' : 'Guardar producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddProductForm

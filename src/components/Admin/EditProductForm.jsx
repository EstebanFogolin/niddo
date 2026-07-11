import { useContext, useState, useCallback, useEffect } from 'react'
import './AddProductForm.css'
import { ProductContext } from '../../context/ProductContext'

const EditProductForm = ({ product, onClose }) => {

    const { updateProduct, features, fetchFeatures, categories, fetchCategories } = useContext(ProductContext)

    const currentFeatureIds = (product.caracteristicas || []).map(c => c.id)

    const [formData, setFormData] = useState({
        name: product.title || '',
        description: product.description || '',
        categoryId: product.categoryId || '',
        caracteristicas: [...currentFeatureIds]
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
                if (trimmed && trimmed.length < 3) return 'El nombre debe tener al menos 3 caracteres.'
                return ''
            }
            case 'description': {
                const trimmed = value.trim()
                if (trimmed && trimmed.length < 10) return 'La descripción debe tener al menos 10 caracteres.'
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

    const validateForm = () => {
        const newErrors = {
            name: validateField('name', formData.name),
            description: validateField('description', formData.description)
        }
        setErrors(newErrors)
        return !Object.values(newErrors).some(Boolean)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        try {
            setSaving(true)
            await updateProduct(product.id, {
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
                <h2 className="form-title">Editar producto</h2>

                {success && <p className="form-success">¡Producto actualizado con éxito!</p>}
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

                    <div className="form-group">
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
                            {saving ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProductForm

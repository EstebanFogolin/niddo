import { useContext, useState, useEffect } from 'react'
import { ProductContext } from '../../context/ProductContext'
import './AddProductForm.css'

const CategoryForm = ({ category, onClose }) => {
    const { createCategory, updateCategory } = useContext(ProductContext)
    const isEditing = !!category

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        imagenUrl: ''
    })

    useEffect(() => {
        if (category) {
            setFormData({
                titulo: category.titulo || '',
                descripcion: category.descripcion || '',
                imagenUrl: category.imagenUrl || ''
            })
        }
    }, [category])

    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)

    const validate = () => {
        const newErrors = {}
        if (!formData.titulo.trim()) newErrors.titulo = 'El título es obligatorio.'
        if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es obligatoria.'
        if (!formData.imagenUrl.trim()) newErrors.imagenUrl = 'La URL de la imagen es obligatoria.'
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
                await updateCategory(category.id, formData.titulo.trim(), formData.descripcion.trim(), formData.imagenUrl.trim())
            } else {
                await createCategory(formData.titulo.trim(), formData.descripcion.trim(), formData.imagenUrl.trim())
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
                <h2 className="form-title">{isEditing ? 'Editar categoría' : 'Agregar categoría'}</h2>

                {success && <p className="form-success">¡Categoría guardada con éxito!</p>}
                {errors.submit && <p className="form-error">{errors.submit}</p>}

                <form onSubmit={handleSubmit} noValidate>
                    <div className={`form-group${errors.titulo ? ' has-error' : ''}`}>
                        <label htmlFor="cat-titulo">Título</label>
                        <input
                            id="cat-titulo"
                            type="text"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            placeholder="Ej: Hoteles, Departamentos"
                        />
                        {errors.titulo && <span className="field-error">{errors.titulo}</span>}
                    </div>

                    <div className={`form-group${errors.descripcion ? ' has-error' : ''}`}>
                        <label htmlFor="cat-descripcion">Descripción</label>
                        <textarea
                            id="cat-descripcion"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Descripción breve de la categoría"
                            rows={3}
                        />
                        {errors.descripcion && <span className="field-error">{errors.descripcion}</span>}
                    </div>

                    <div className={`form-group${errors.imagenUrl ? ' has-error' : ''}`}>
                        <label htmlFor="cat-imagen">URL de imagen</label>
                        <input
                            id="cat-imagen"
                            type="url"
                            name="imagenUrl"
                            value={formData.imagenUrl}
                            onChange={handleChange}
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                        {errors.imagenUrl && <span className="field-error">{errors.imagenUrl}</span>}
                        {formData.imagenUrl && (
                            <p className="form-hint">
                                Vista previa: <img src={formData.imagenUrl} alt="" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4, verticalAlign: 'middle', marginLeft: 8 }} />
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

export default CategoryForm

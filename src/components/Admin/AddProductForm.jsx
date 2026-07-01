import { useContext, useState } from 'react'
import './AddProductForm.css'
import { ProductContext } from '../../context/ProductContext'

const AddProductForm = ({ onClose }) => {

    const { products, addProduct } = useContext(ProductContext)

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        images: []
    })

    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [saving, setSaving] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
    }

    const handleImages = (e) => {
        const files = Array.from(e.target.files)
        setFormData({ ...formData, images: files })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.images.length === 0) {
            setError('Debe agregar al menos una imagen.')
            return
        }

        const exists = products.some(
            (p) => p.title.toLowerCase() === formData.name.trim().toLowerCase()
        )

        if (exists) {
            setError('Ya existe un producto con ese nombre.')
            return
        }

        try {
            setSaving(true)
            await addProduct(formData)
            setSuccess(true)
            setTimeout(() => {
                onClose()
            }, 1500)
        } catch (error) {
            setError(error.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="form-overlay">
            <div className="form-container">
                <h2 className="form-title">Agregar producto</h2>

                {success && <p className="form-success">¡Producto agregado con éxito!</p>}
                {error && <p className="form-error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nombre del producto"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Descripción del producto"
                            rows={4}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Imágenes</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImages}
                        />
                        {formData.images.length > 0 && (
                            <p className="form-img-count">{formData.images.length} imagen(es) seleccionada(s)</p>
                        )}
                    </div>

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

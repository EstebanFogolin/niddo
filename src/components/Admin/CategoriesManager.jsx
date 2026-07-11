import { useContext, useEffect, useState } from 'react'
import { ProductContext } from '../../context/ProductContext'
import CategoryForm from './CategoryForm'
import './ProductList.css'

const CategoriesManager = () => {
    const { categories, categoriesLoading, fetchCategories, deleteCategory } = useContext(ProductContext)
    const [showForm, setShowForm] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)
    const [confirmId, setConfirmId] = useState(null)

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    const handleEdit = (cat) => {
        setEditingCategory(cat)
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        try {
            await deleteCategory(id)
            setConfirmId(null)
        } catch (err) {
            alert(err.message)
        }
    }

    if (categoriesLoading && categories.length === 0) {
        return <p className="product-list-empty">Cargando categorías...</p>
    }

    return (
        <div className="product-list-container">
            <h2 className="product-list-title">Categorías</h2>

            <button className="edit-btn" style={{ marginBottom: 12 }} onClick={() => { setEditingCategory(null); setShowForm(true) }}>
                Agregar categoría
            </button>

            {categories.length === 0 ? (
                <p className="product-list-empty">No hay categorías creadas.</p>
            ) : (
                <table className="product-list-table">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Título</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat.id}>
                                <td>
                                    <img src={cat.imagenUrl} alt={cat.titulo} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                                </td>
                                <td><strong>{cat.titulo}</strong></td>
                                <td style={{ fontSize: 13, color: '#666' }}>{cat.descripcion}</td>
                                <td>
                                    {confirmId === cat.id ? (
                                        <div className="confirm-actions">
                                            <span className="confirm-text">¿Eliminar?</span>
                                            <button className="confirm-yes" onClick={() => handleDelete(cat.id)}>Sí</button>
                                            <button className="confirm-no" onClick={() => setConfirmId(null)}>No</button>
                                        </div>
                                    ) : (
                                        <div className="action-buttons">
                                            <button className="edit-btn" onClick={() => handleEdit(cat)}>Editar</button>
                                            <button className="delete-btn" onClick={() => setConfirmId(cat.id)}>Eliminar</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showForm && (
                <CategoryForm
                    category={editingCategory}
                    onClose={() => { setShowForm(false); setEditingCategory(null) }}
                />
            )}
        </div>
    )
}

export default CategoriesManager

import { useContext, useEffect, useState } from 'react'
import { ProductContext } from '../../context/ProductContext'
import CategoryForm from './CategoryForm'
import DeleteCategoryModal from './DeleteCategoryModal'
import './ProductList.css'

const CategoriesManager = () => {
    const { categories, categoriesLoading, fetchCategories, deleteCategory } = useContext(ProductContext)
    const [showForm, setShowForm] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)
    const [categoryToDelete, setCategoryToDelete] = useState(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    const handleEdit = (cat) => {
        setEditingCategory(cat)
        setShowForm(true)
    }

    const handleDeleteClick = (cat) => {
        setCategoryToDelete(cat)
    }

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return
        setDeleting(true)
        try {
            await deleteCategory(categoryToDelete.id)
        } catch (err) {
            alert(err.message)
        } finally {
            setDeleting(false)
            setCategoryToDelete(null)
        }
    }

    const handleCloseDeleteModal = () => {
        setCategoryToDelete(null)
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
                                    <div className="action-buttons">
                                        <button className="edit-btn" onClick={() => handleEdit(cat)}>Editar</button>
                                        <button className="delete-btn" onClick={() => handleDeleteClick(cat)}>Eliminar</button>
                                    </div>
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

            <DeleteCategoryModal
                isOpen={!!categoryToDelete}
                onClose={handleCloseDeleteModal}
                category={categoryToDelete}
                onConfirm={handleConfirmDelete}
                loading={deleting}
            />
        </div>
    )
}

export default CategoriesManager

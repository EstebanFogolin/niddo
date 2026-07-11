import { useContext, useState } from 'react'
import { ProductContext } from '../../context/ProductContext'
import EditProductForm from './EditProductForm'
import './ProductList.css'

const ProductList = () => {
  const { products, deleteProduct } = useContext(ProductContext)
  const [confirmId, setConfirmId] = useState(null)
  const [editProduct, setEditProduct] = useState(null)

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id)
      setConfirmId(null)
    } catch {
      alert('Error al eliminar el producto.')
    }
  }

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Lista de productos</h2>

      {products.length === 0 ? (
        <p className="product-list-empty">No hay productos disponibles.</p>
      ) : (
        <table className="product-list-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.title}</td>
                <td>{product.category}</td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn" onClick={() => setEditProduct(product)}>
                      Editar
                    </button>
                    {confirmId === product.id ? (
                      <div className="confirm-actions">
                        <button className="confirm-yes" onClick={() => handleDelete(product.id)}>Sí</button>
                        <button className="confirm-no" onClick={() => setConfirmId(null)}>No</button>
                      </div>
                    ) : (
                      <button className="delete-btn" onClick={() => setConfirmId(product.id)}>
                        Eliminar
                      </button>
                    )}
                    {confirmId === product.id && <span className="confirm-text">¿Eliminar?</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editProduct && (
        <EditProductForm product={editProduct} onClose={() => setEditProduct(null)} />
      )}
    </div>
  )
}

export default ProductList

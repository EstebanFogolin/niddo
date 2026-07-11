import { useContext, useEffect, useState } from 'react'
import { ProductContext } from '../../context/ProductContext'
import FeatureForm from './FeatureForm'
import './ProductList.css'

const FeaturesManager = () => {
    const { features, featuresLoading, fetchFeatures, deleteFeature } = useContext(ProductContext)
    const [showForm, setShowForm] = useState(false)
    const [editingFeature, setEditingFeature] = useState(null)
    const [confirmId, setConfirmId] = useState(null)

    useEffect(() => {
        fetchFeatures()
    }, [fetchFeatures])

    const handleEdit = (feature) => {
        setEditingFeature(feature)
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        try {
            await deleteFeature(id)
            setConfirmId(null)
        } catch (err) {
            alert(err.message)
        }
    }

    if (featuresLoading && features.length === 0) {
        return <p className="product-list-empty">Cargando características...</p>
    }

    return (
        <div className="product-list-container">
            <h2 className="product-list-title">Características</h2>

            <button className="edit-btn" style={{ marginBottom: 12 }} onClick={() => { setEditingFeature(null); setShowForm(true) }}>
                Agregar característica
            </button>

            {features.length === 0 ? (
                <p className="product-list-empty">No hay características creadas.</p>
            ) : (
                <table className="product-list-table">
                    <thead>
                        <tr>
                            <th>Icono</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {features.map(f => (
                            <tr key={f.id}>
                                <td><i className={f.icono} style={{ fontSize: 20 }}></i></td>
                                <td>{f.nombre}</td>
                                <td>
                                    {confirmId === f.id ? (
                                        <div className="confirm-actions">
                                            <span className="confirm-text">¿Eliminar?</span>
                                            <button className="confirm-yes" onClick={() => handleDelete(f.id)}>Sí</button>
                                            <button className="confirm-no" onClick={() => setConfirmId(null)}>No</button>
                                        </div>
                                    ) : (
                                        <div className="action-buttons">
                                            <button className="edit-btn" onClick={() => handleEdit(f)}>Editar</button>
                                            <button className="delete-btn" onClick={() => setConfirmId(f.id)}>Eliminar</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showForm && (
                <FeatureForm
                    feature={editingFeature}
                    onClose={() => { setShowForm(false); setEditingFeature(null) }}
                />
            )}
        </div>
    )
}

export default FeaturesManager

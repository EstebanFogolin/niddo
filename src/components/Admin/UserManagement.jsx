import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import './ProductList.css'

const API_URL = 'http://localhost:8080'

const UserManagement = () => {

    const { getAuthHeaders } = useContext(AuthContext)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [changingId, setChangingId] = useState(null)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const headers = getAuthHeaders()
                const response = await fetch(`${API_URL}/api/admin/usuarios`, { headers })

                if (!response.ok) throw new Error('No se pudieron cargar los usuarios.')

                const data = await response.json()
                setUsers(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [getAuthHeaders])

    const toggleRole = async (userId) => {
        setChangingId(userId)
        try {
            const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' }
            const response = await fetch(`${API_URL}/api/admin/usuarios/${userId}/role`, {
                method: 'PUT',
                headers
            })

            if (!response.ok) throw new Error('No se pudo cambiar el rol.')

            const updated = await response.json()
            setUsers(prev => prev.map(u => u.id === updated.id ? updated : u))
        } catch (err) {
            alert(err.message)
        } finally {
            setChangingId(null)
        }
    }

    if (loading) return <p className="product-list-empty">Cargando usuarios...</p>
    if (error) return <p className="product-list-empty">{error}</p>

    return (
        <div className="product-list-container">
            <h2 className="product-list-title">Administrar usuarios</h2>

            {users.length === 0 ? (
                <p className="product-list-empty">No hay usuarios registrados.</p>
            ) : (
                <table className="product-list-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.nombre} {user.apellido}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`role-badge role-${user.role.toLowerCase()}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className={user.role === 'ADMIN' ? 'delete-btn' : 'edit-btn'}
                                        onClick={() => toggleRole(user.id)}
                                        disabled={changingId === user.id}
                                    >
                                        {changingId === user.id
                                            ? 'Cambiando...'
                                            : user.role === 'ADMIN'
                                                ? 'Quitar admin'
                                                : 'Hacer admin'
                                        }
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default UserManagement

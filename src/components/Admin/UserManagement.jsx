import { useState, useEffect, useContext, useCallback } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { API_URL } from '../../config/api.js'
import './ProductList.css'

const UserManagement = () => {

    const { getAuthHeaders } = useContext(AuthContext)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [changingId, setChangingId] = useState(null)

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true)
            setError('')
            const response = await fetch(`${API_URL}/api/admin/usuarios`, { headers: getAuthHeaders() })

            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('Acceso denegado: necesitás rol ADMIN. Promové tu usuario vía H2 console: UPDATE USUARIO SET ROLE=\'ADMIN\' WHERE email=\'tu@mail\';')
                }
                const apiError = await response.json().catch(() => null)
                throw new Error(apiError?.mensaje || `No se pudieron cargar los usuarios. (HTTP ${response.status})`)
            }

            setUsers(await response.json())
        } catch (err) {
            console.error('[UserManagement] fetchUsers failed:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [getAuthHeaders])

    useEffect(function loadUsers() {
        fetchUsers()
    }, [fetchUsers])

    const toggleRole = async (userId) => {
        setChangingId(userId)
        try {
            const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' }
            const response = await fetch(`${API_URL}/api/admin/usuarios/${userId}/role`, {
                method: 'PUT',
                headers
            })

            if (!response.ok) {
                if (response.status === 403) throw new Error('Acceso denegado: necesitás rol ADMIN.')
                const body = await response.text().catch(() => '')
                console.error('[UserManagement] toggleRole failed:', response.status, body)
                throw new Error('No se pudo cambiar el rol.')
            }

            const updated = await response.json()
            setUsers(prev => prev.map(u => u.id === updated.id ? updated : u))
        } catch (err) {
            console.error('[UserManagement] toggleRole error:', err)
            alert(err.message)
        } finally {
            setChangingId(null)
        }
    }

    if (loading) return <p className="product-list-empty">Cargando usuarios...</p>
    if (error) return <p className="product-list-empty">{error}</p>

    return (
        <div className="product-list-container">
            <div className="product-list-header">
                <h2 className="product-list-title">Administrar usuarios</h2>
                <button className="edit-btn" onClick={fetchUsers}>Actualizar lista</button>
            </div>

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

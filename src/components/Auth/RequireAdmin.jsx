import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const RequireAdmin = ({ children }) => {
    const { isAuthenticated, isAdmin } = useContext(AuthContext)
    const location = useLocation()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />
    }

    return children
}

export default RequireAdmin

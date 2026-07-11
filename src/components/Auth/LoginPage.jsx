import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { Header } from '../Header/Header'
import { Footer } from '../Footer/Footer'
import './LoginPage.css'

const LoginPage = () => {

    const navigate = useNavigate()
    const { login } = useContext(AuthContext)

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)
    const [serverError, setServerError] = useState('')

    const validateField = (name, value) => {
        switch (name) {
            case 'email': {
                const trimmed = value.trim()
                if (!trimmed) return 'El email es obligatorio.'
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Ingrese un email válido.'
                return ''
            }
            case 'password': {
                if (!value) return 'La contraseña es obligatoria.'
                return ''
            }
            default:
                return ''
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        const error = validateField(name, value)
        setErrors(prev => ({ ...prev, [name]: error }))
        setServerError('')
    }

    const validateForm = () => {
        const newErrors = {
            email: validateField('email', formData.email),
            password: validateField('password', formData.password)
        }
        setErrors(newErrors)
        return !Object.values(newErrors).some(Boolean)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        try {
            setSaving(true)
            setServerError('')
            await login(formData.email, formData.password)
            navigate('/')
        } catch (error) {
            setServerError(error.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            <Header />
            <main className="login-page">
                <div className="login-container">
                    <h1 className="login-title">Iniciar sesión</h1>

                    {serverError && <p className="form-error">{serverError}</p>}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className={`form-group${errors.email ? ' has-error' : ''}`}>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="correo@ejemplo.com"
                            />
                            {errors.email && <span className="field-error">{errors.email}</span>}
                        </div>

                        <div className={`form-group${errors.password ? ' has-error' : ''}`}>
                            <label htmlFor="password">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Tu contraseña"
                            />
                            {errors.password && <span className="field-error">{errors.password}</span>}
                        </div>

                        <button type="submit" className="login-submit" disabled={saving}>
                            {saving ? 'Ingresando...' : 'Iniciar sesión'}
                        </button>
                    </form>

                    <p className="login-register-link">
                        ¿No tenés cuenta? <Link to="/registro">Crear cuenta</Link>
                    </p>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default LoginPage

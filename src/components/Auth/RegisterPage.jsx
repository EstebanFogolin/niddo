import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../Header/Header'
import { Footer } from '../Footer/Footer'
import './RegisterPage.css'

const API_URL = 'http://localhost:8080'

const RegisterPage = () => {

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)
    const [serverError, setServerError] = useState('')
    const [registeredEmail, setRegisteredEmail] = useState('')
    const [resending, setResending] = useState(false)
    const [resendMsg, setResendMsg] = useState('')

    const validateField = (name, value) => {
        switch (name) {
            case 'nombre': {
                const trimmed = value.trim()
                if (!trimmed) return 'El nombre es obligatorio.'
                if (trimmed.length < 2) return 'El nombre debe tener al menos 2 caracteres.'
                return ''
            }
            case 'apellido': {
                const trimmed = value.trim()
                if (!trimmed) return 'El apellido es obligatorio.'
                if (trimmed.length < 2) return 'El apellido debe tener al menos 2 caracteres.'
                return ''
            }
            case 'email': {
                const trimmed = value.trim()
                if (!trimmed) return 'El email es obligatorio.'
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Ingrese un email válido.'
                return ''
            }
            case 'password': {
                if (!value) return 'La contraseña es obligatoria.'
                if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres.'
                return ''
            }
            case 'confirmPassword': {
                if (!value) return 'Debe confirmar la contraseña.'
                if (value !== formData.password) return 'Las contraseñas no coinciden.'
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
            nombre: validateField('nombre', formData.nombre),
            apellido: validateField('apellido', formData.apellido),
            email: validateField('email', formData.email),
            password: validateField('password', formData.password),
            confirmPassword: validateField('confirmPassword', formData.confirmPassword)
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

            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: formData.nombre.trim(),
                    apellido: formData.apellido.trim(),
                    email: formData.email.trim(),
                    password: formData.password
                })
            })

            if (response.status === 409) {
                setErrors(prev => ({ ...prev, email: 'Este email ya está registrado.' }))
                return
            }

            if (!response.ok) {
                throw new Error('Error al registrar. Intente nuevamente.')
            }

            setRegisteredEmail(formData.email.trim())
        } catch (error) {
            setServerError(error.message)
        } finally {
            setSaving(false)
        }
    }

    const handleResend = async () => {
        try {
            setResending(true)
            setResendMsg('')
            const response = await fetch(`${API_URL}/api/auth/resend-confirmation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: registeredEmail })
            })
            if (!response.ok) {
                throw new Error('No se pudo reenviar el email.')
            }
            setResendMsg('¡Email reenviado con éxito!')
        } catch {
            setResendMsg('Error al reenviar. Intente más tarde.')
        } finally {
            setResending(false)
        }
    }

    if (registeredEmail) {
        return (
            <>
                <Header />
                <main className="register-page">
                    <div className="register-container register-confirmation">
                        <div className="confirmation-icon">✓</div>
                        <h1 className="register-title">¡Registro exitoso!</h1>
                        <p className="confirmation-text">
                            Te enviamos un email de confirmación a <strong>{registeredEmail}</strong>
                        </p>
                        <p className="confirmation-text">
                            Revisá tu bandeja de entrada para verificar tu cuenta.
                        </p>

                        {resendMsg && <p className={`resend-msg ${resendMsg.includes('éxito') ? 'success' : 'error'}`}>{resendMsg}</p>}

                        <button className="register-submit" onClick={handleResend} disabled={resending} style={{ marginTop: 16 }}>
                            {resending ? 'Reenviando...' : 'Reenviar email'}
                        </button>

                        <p className="register-login-link" style={{ marginTop: 20 }}>
                            <Link to="/login">Ir a iniciar sesión</Link>
                        </p>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />
            <main className="register-page">
                <div className="register-container">
                    <h1 className="register-title">Crear cuenta</h1>

                    {serverError && <p className="form-error">{serverError}</p>}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className={`form-group${errors.nombre ? ' has-error' : ''}`}>
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                id="nombre"
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Tu nombre"
                            />
                            {errors.nombre && <span className="field-error">{errors.nombre}</span>}
                        </div>

                        <div className={`form-group${errors.apellido ? ' has-error' : ''}`}>
                            <label htmlFor="apellido">Apellido</label>
                            <input
                                id="apellido"
                                type="text"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                placeholder="Tu apellido"
                            />
                            {errors.apellido && <span className="field-error">{errors.apellido}</span>}
                        </div>

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
                                placeholder="Mínimo 6 caracteres"
                            />
                            {errors.password && <span className="field-error">{errors.password}</span>}
                        </div>

                        <div className={`form-group${errors.confirmPassword ? ' has-error' : ''}`}>
                            <label htmlFor="confirmPassword">Confirmar contraseña</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repite la contraseña"
                            />
                            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                        </div>

                        <button type="submit" className="register-submit" disabled={saving}>
                            {saving ? 'Registrando...' : 'Crear cuenta'}
                        </button>
                    </form>

                    <p className="register-login-link">
                        ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
                    </p>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default RegisterPage

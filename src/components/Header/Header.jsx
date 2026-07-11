import { useContext, useState } from 'react';
import logo from '../../assets/fondo_transparent.png';
import "./Header.css";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export const Header = () => {

    const { user, isAuthenticated, logout } = useContext(AuthContext)
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const initials = user
        ? (user.nombre.charAt(0) + user.apellido.charAt(0)).toUpperCase()
        : ''

    return (
        <header className="header">
            <div className="header-left">
                <Link to='/'>
                    <img src={logo} alt="logo niddo" className="logo-img" />
                </Link>
                <span className='slogan'>Tu casa donde vayas!</span>
            </div>
            <button
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                ☰
            </button>
            <div className={`header-right ${menuOpen ? 'mobile-menu active' : 'mobile-menu'}`}>
                {isAuthenticated ? (
                    <div className="user-info">
                        <div className="user-info-top">
                            <span className="user-avatar">{initials}</span>
                            <span className="user-name">{user.nombre} {user.apellido}</span>
                        </div>
                        <button className="logout-boton" onClick={() => { logout(); navigate('/') }}>
                            Cerrar sesión
                        </button>
                    </div>
                ) : (
                    <>
                        <button className='login-boton' onClick={() => navigate('/login')}>
                            Iniciar sesión
                        </button>
                        <button className='create-boton' onClick={() => navigate('/registro')}>
                            Crear cuenta
                        </button>
                    </>
                )}
            </div>
        </header>
    )
}

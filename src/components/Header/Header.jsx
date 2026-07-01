import { useState } from 'react';
import logo from '../../assets/fondo_transparent.png';
import "./Header.css";
import { Link, Navigate } from 'react-router-dom';

export const Header = () => {

    const [menuOpen, setMenuOpen] = useState(false)

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
                onClick={() => setMenuOpen(!menuOpen)
                }

            >
                ☰
            </button>
            <div className={`header-right ${menuOpen ? 'mobile-menu active' : 'mobile-menu'}`}>
                <button className='login-boton'>Iniciar sesión</button>
                <button className='create-boton'>Crear cuenta</button>
            </div>
        </header>

    )
}

import logo from '../../assets/fondo_transparent.png'
import './Footer.css'

const currentYear = new Date().getFullYear()

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-brand">
                <img src={logo} alt="Niddo" className="footer-logo" />
                <span>©{currentYear} Niddo Booking</span>
            </div>

            <div className="footer-social" aria-label="Redes sociales">
                <a href="https://facebook.com" aria-label="Facebook">f</a>
                <a href="https://linkedin.com" aria-label="LinkedIn">in</a>
                <a href="https://twitter.com" aria-label="Twitter">x</a>
                <a href="https://instagram.com" aria-label="Instagram">◎</a>
            </div>
        </footer>
    )
}

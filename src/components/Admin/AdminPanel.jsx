import { useState, useEffect, useContext } from 'react'
import AddProductForm from './AddProductForm'
import ProductList from './ProductList'
import UserManagement from './UserManagement'
import FeaturesManager from './FeaturesManager'
import CategoriesManager from './CategoriesManager'
import './AdminPanel.css'
import { Header } from '../Header/Header'
import { Footer } from '../Footer/Footer'
import { AuthContext } from '../../context/AuthContext'

const AdminPanel = () => {

  const { isAuthenticated, isAdmin } = useContext(AuthContext)

  const [showForm, setShowForm] = useState(false)
  const [showList, setShowList] = useState(false)
  const [showUsers, setShowUsers] = useState(false)
  const [showFeatures, setShowFeatures] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (isMobile) {
    return (
      <>
        <Header />
        <div className='admin-panel'>
          <p className='mobile-warning'>El panel de administración no está disponible en dispositivos móviles.</p>
        </div>
        <Footer />
      </>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className='admin-panel'>
          <p className='mobile-warning'>Debe iniciar sesión como administrador para acceder a esta sección.</p>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className='admin-panel'>
        <h1 className='panel-title'>Panel de administración</h1>
        <div className='admin-menu'>
          <button className='admin-btn' onClick={() => { setShowForm(true); setShowList(false); setShowUsers(false) }}>
            Agregar producto
          </button>
          <button className='admin-btn' onClick={() => { setShowList(!showList); setShowForm(false); setShowUsers(false) }}>
            {showList ? 'Ocultar lista' : 'Lista de productos'}
          </button>
          {isAdmin && (
            <button className='admin-btn' onClick={() => { setShowUsers(!showUsers); setShowForm(false); setShowList(false); setShowFeatures(false) }}>
              {showUsers ? 'Ocultar usuarios' : 'Administrar usuarios'}
            </button>
          )}
          {isAdmin && (
            <button className='admin-btn' onClick={() => { setShowFeatures(!showFeatures); setShowForm(false); setShowList(false); setShowUsers(false); setShowCategories(false) }}>
              {showFeatures ? 'Ocultar características' : 'Administrar características'}
            </button>
          )}
          {isAdmin && (
            <button className='admin-btn' onClick={() => { setShowCategories(!showCategories); setShowForm(false); setShowList(false); setShowUsers(false); setShowFeatures(false) }}>
              {showCategories ? 'Ocultar categorías' : 'Administrar categorías'}
            </button>
          )}
        </div>
        {showForm && <AddProductForm onClose={() => setShowForm(false)} />}
        {showList && <ProductList />}
        {showUsers && <UserManagement />}
        {showFeatures && <FeaturesManager />}
        {showCategories && <CategoriesManager />}
      </div>
      <Footer />
    </>
  )
}

export default AdminPanel

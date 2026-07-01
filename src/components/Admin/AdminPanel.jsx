import { useState, useEffect } from 'react'
import AddProductForm from './AddProductForm'
import ProductList from './ProductList'
import './AdminPanel.css'
import { Header } from '../Header/Header'
import { Footer } from '../Footer/Footer'

const AdminPanel = () => {

  const [showForm, setShowForm] = useState(false)
  const [showList, setShowList] = useState(false)
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

  return (
    <>
      <Header />
      <div className='admin-panel'>
        <h1 className='panel-title'>Panel de administración</h1>
        <div className='admin-menu'>
          <button className='admin-btn' onClick={() => { setShowForm(true); setShowList(false) }}>
            Agregar producto
          </button>
          <button className='admin-btn' onClick={() => { setShowList(!showList); setShowForm(false) }}>
            {showList ? 'Ocultar lista' : 'Lista de productos'}
          </button>
        </div>
        {showForm && <AddProductForm onClose={() => setShowForm(false)} />}
        {showList && <ProductList />}
      </div>
      <Footer />
    </>
  )
}

export default AdminPanel

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminPanel from './components/Admin/AdminPanel.jsx'
import { ProductProvider } from './context/ProductProvider.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import ProductDetail from './components/ProductDetail/ProductDetail.jsx'
import RegisterPage from './components/Auth/RegisterPage.jsx'
import LoginPage from './components/Auth/LoginPage.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <AuthProvider>
        <ProductProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/administracion" element={<AdminPanel />} />
            <Route path="/productos/:id" element={<ProductDetail />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </ProductProvider>
      </AuthProvider>
    </StrictMode>
  </BrowserRouter>
)

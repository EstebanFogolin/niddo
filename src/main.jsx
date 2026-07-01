import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminPanel from './components/Admin/AdminPanel.jsx'
import { ProductProvider } from './context/ProductProvider.jsx'
import ProductDetail from './components/ProductDetail/ProductDetail.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <ProductProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/administracion" element={<AdminPanel />} />
          <Route path="/productos/:id" element={<ProductDetail />} />
        </Routes>
      </ProductProvider>
    </StrictMode>
  </BrowserRouter>
)

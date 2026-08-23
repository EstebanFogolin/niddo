import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import { ProductProvider } from './context/ProductProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ProductProvider>
        <App />
      </ProductProvider>
    </AuthProvider>
  </StrictMode>
)

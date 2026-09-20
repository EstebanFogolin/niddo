import { Header } from "./components/Header/Header"
import { Navbar } from "./components/Navbar/Navbar"
import { Main } from "./components/Main/Main"
import CategoryList from "./components/Categories/CategoriesList"
import CategoryFilter from "./components/Categories/CategoryFilter"
import SearchBlock from "./components/Search/SearchBlock"
import "./App.css"
import Recommendations from "./components/RecomendCards/Recommendations"
import { Footer } from "./components/Footer/Footer"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { FavoritesProvider } from "./context/FavoritesContext"
import FavoritesPage from "./components/Favorites/FavoritesPage"
import RequireAuth from "./components/Auth/RequireAuth"
import RequireAdmin from "./components/Auth/RequireAdmin"
import AdminPanel from "./components/Admin/AdminPanel"
import ProductDetail from "./components/ProductDetail/ProductDetail"
import RegisterPage from "./components/Auth/RegisterPage"
import LoginPage from "./components/Auth/LoginPage"
import ReservationsPage from "./components/Reservations/ReservationsPage"
import ReservationConfirmationPage from "./components/Reservations/ReservationConfirmationPage"
import WhatsAppButton from "./components/WhatsApp/WhatsAppButton"


// Home page con el layout completo (Header, Main, Footer)
const HomePage = () => {
  return (
    <>
      <Header />
      <Main>
        <Navbar />
        <SearchBlock />
        <CategoryList />
        <CategoryFilter />
        <Recommendations />
      </Main>
      <Footer />
    </>
  )
}


export const App = () => {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/productos/:id" element={<ProductDetail />} />
          <Route path="/favoritos" element={
            <RequireAuth>
              <FavoritesPage />
            </RequireAuth>
          } />
          <Route path="/administracion" element={
            <RequireAdmin>
              <AdminPanel />
            </RequireAdmin>
          } />
          <Route path="/mis-reservas" element={
            <RequireAuth>
              <ReservationsPage />
            </RequireAuth>
          } />
          <Route path="/reserva-confirmada" element={
            <RequireAuth>
              <ReservationConfirmationPage />
            </RequireAuth>
          } />
        </Routes>
        <WhatsAppButton />
      </FavoritesProvider>
    </BrowserRouter>
  )
}
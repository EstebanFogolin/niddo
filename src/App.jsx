import { Header } from "./components/Header/Header"
import { Navbar } from "./components/Navbar/Navbar"
import { Main } from "./components/Main/Main"
import CategoryList from "./components/Categories/CategoriesList"
import "./App.css"
import Recommendations from "./components/RecomendCards/Recommendations"
import { Footer } from "./components/Footer/Footer"


export const App = () => {
  return (
    <>
      <Header />
      <Main>
        <Navbar />
        <CategoryList />
        <Recommendations />
      </Main>
      <Footer />
    </>
  )
}

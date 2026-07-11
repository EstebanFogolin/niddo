import { useContext, useEffect } from "react";
import Card from "../Cards/Card";
import categoriesFallback from "../../data/Categories";
import './CategoriesList.css';
import { ProductContext } from "../../context/ProductContext";

const CategoriesList = () => {
  const { categories, categoriesLoading, fetchCategories } = useContext(ProductContext)

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const displayCategories = categories.length > 0 ? categories : categoriesFallback

  return (
    <section className="category-section">
      <h2 className="category-title">Buscar por tipo de alojamiento</h2>
      {categoriesLoading && categories.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>Cargando categorías...</p>
      ) : (
        <div className="category-grid">
          {displayCategories.map((cat) => (
            <Card
              key={cat.id}
              title={cat.titulo || cat.title}
              img={cat.imagenUrl || cat.img}
              count={cat.count || ''}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default CategoriesList;

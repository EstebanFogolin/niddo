import Card from "../Cards/Card";
import categories from "../../data/Categories";
import './CategoriesList.css';

const CategoriesList = () => {
  return (
    <>
      <section className="category-section">
        <h2 className="category-title">Buscar por tipo de alojamiento</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <Card
              key={cat.id}
              title={cat.title}
              img={cat.img}
              count={cat.count}
            />
          ))}
        </div>
      </section>
    </>
  )
}

export default CategoriesList;

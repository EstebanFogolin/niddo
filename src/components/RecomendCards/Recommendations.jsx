import { useContext, useState } from "react";
import ProductCard from "./ProductCard";
import './Recommendations.css';
import { ProductContext } from "../../context/ProductContext";

const ITEMS_PER_PAGE = 10

const Recommendations = () => {

  const { products } = useContext(ProductContext)
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE))
  const safePage = page > totalPages ? totalPages : page
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE
  const pageProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <section className="recommendations-section">
      <h2 className="recommendations-title">Recomendaciones</h2>
      <div className="recommendations-grid">
        {pageProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            category={product.category}
            stars={product.stars}
            score={product.score}
            scoreLabel={product.scoreLabel}
            distance={product.distance}
            img={product.img}
          />
        ))}
      </div>

      <div className="pagination">
        <button
          className="pagination-btn"
          disabled={safePage <= 1}
          onClick={() => setPage(1)}
        >
          {'<<'}
        </button>
        <button
          className="pagination-btn"
          disabled={safePage <= 1}
          onClick={() => setPage(safePage - 1)}
        >
          {'<'}
        </button>
        <span className="pagination-info">{safePage} / {totalPages}</span>
        <button
          className="pagination-btn"
          disabled={safePage >= totalPages}
          onClick={() => setPage(safePage + 1)}
        >
          {'>'}
        </button>
        <button
          className="pagination-btn"
          disabled={safePage >= totalPages}
          onClick={() => setPage(totalPages)}
        >
          {'>>'}
        </button>
      </div>
    </section>
  )
}

export default Recommendations

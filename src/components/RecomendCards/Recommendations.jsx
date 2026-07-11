import { useContext, useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import './Recommendations.css';
import { ProductContext } from "../../context/ProductContext";

const MAX_RECOMMENDATIONS = 10

function fisherYatesShuffle(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

function pickRandom(array, count) {
    if (array.length === 0) return []
    const shuffled = fisherYatesShuffle(array)
    return shuffled.slice(0, Math.min(count, shuffled.length))
}

const Recommendations = () => {

    const { products } = useContext(ProductContext)
    const [randomProducts, setRandomProducts] = useState([])

    useEffect(() => {
        setRandomProducts(pickRandom(products, MAX_RECOMMENDATIONS))
    }, [products])

    const handleRefresh = () => {
        setRandomProducts(pickRandom(products, MAX_RECOMMENDATIONS))
    }

    return (
        <section className="recommendations-section">
            <div className="recommendations-header">
                <h2 className="recommendations-title">Recomendaciones</h2>
                {products.length > 0 && (
                    <button className="refresh-btn" onClick={handleRefresh}>
                        ↻ Refrescar
                    </button>
                )}
            </div>
            {randomProducts.length === 0 ? (
                <p className="recommendations-empty">No hay productos disponibles.</p>
            ) : (
                <div className="recommendations-grid">
                    {randomProducts.map((product) => (
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
            )}
        </section>
    )
}

export default Recommendations

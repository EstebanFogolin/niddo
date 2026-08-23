import { useContext, useId, useMemo } from "react";
import ProductCard from "./ProductCard";
import './Recommendations.css';
import { ProductContext } from "../../context/ProductContext";

const MAX_RECOMMENDATIONS = 10

const hashProductId = (id, seed) => {
    const value = `${seed}:${id}`
    let hash = 0

    for (let index = 0; index < value.length; index += 1) {
        hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0
    }

    return hash
}

const Recommendations = () => {

    const { products } = useContext(ProductContext)
    const pageSeed = useId()

    const recommendedProducts = useMemo(() => {
        return [...products]
            .sort((first, second) => hashProductId(first.id, pageSeed) - hashProductId(second.id, pageSeed))
            .slice(0, MAX_RECOMMENDATIONS)
    }, [pageSeed, products])

    return (
        <section className="recommendations-section">
            <div className="recommendations-header">
                <h2 className="recommendations-title">Recomendaciones</h2>
            </div>
            {recommendedProducts.length === 0 ? (
                <p className="recommendations-empty">No hay productos disponibles.</p>
            ) : (
                <div className="recommendations-grid">
                    {recommendedProducts.map((product) => (
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
                            showFavoriteButton
                        />
                    ))}
                </div>
            )}
        </section>
    )
}

export default Recommendations

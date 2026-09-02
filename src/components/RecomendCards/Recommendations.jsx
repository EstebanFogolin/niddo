import { useContext, useMemo } from "react";
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

const Recommendations = () => {

    const { products } = useContext(ProductContext)

    // Fisher-Yates en cada montaje: Math.random() genera orden distinto
    // cada vez que HomePage se monta (navegar a "/" tras estar en detalle)
    const recommendedProducts = useMemo(() => {
        if (products.length === 0) return []
        return fisherYatesShuffle(products).slice(0, MAX_RECOMMENDATIONS)
    }, [products])

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
                            promedioPuntuacion={product.promedioPuntuacion}
                            totalResenas={product.totalResenas}
                            showFavoriteButton
                        />
                    ))}
                </div>
            )}
        </section>
    )
}

export default Recommendations

import { useContext, useEffect } from 'react'
import { ProductContext } from '../../context/ProductContext'
import './CategoryFilter.css'

const CategoryFilter = () => {
    const { categories, categoriesLoading, fetchCategories, products, selectedCategoryIds, toggleCategoryFilter, clearCategoryFilters } = useContext(ProductContext)

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    const getCountByCategory = (catId) => {
        return products.filter(p => Number(p.categoryId) === Number(catId)).length
    }

    return (
        <section className="category-filter">
            <div className="category-filter-header">
                <h2 className="category-filter-title">Filtrar por categoría</h2>
                {selectedCategoryIds.length > 0 && (
                    <button className="category-clear-btn" onClick={clearCategoryFilters}>
                        Limpiar filtros
                    </button>
                )}
            </div>
            {categoriesLoading && categories.length === 0 ? (
                <p className="category-filter-loading">Cargando categorías...</p>
            ) : (
                <div className={`category-filter-list ${categories.length > 4 ? 'scrollable' : ''}`}>
                    {categories.map(cat => {
                        const isSelected = selectedCategoryIds.includes(cat.id)
                        const count = getCountByCategory(cat.id)
                        return (
                            <button
                                key={cat.id}
                                className={`category-filter-btn ${isSelected ? 'selected' : ''}`}
                                onClick={() => toggleCategoryFilter(cat.id)}
                            >
                                <span className="category-filter-name">{cat.titulo}</span>
                                <span className="category-filter-count">({count})</span>
                            </button>
                        )
                    })}
                </div>
            )}
            <p className="category-filter-total">
                Mostrando {products.length} producto{products.length !== 1 ? 's' : ''}
                {selectedCategoryIds.length > 0 && (
                    <> en {selectedCategoryIds.length} categoría{selectedCategoryIds.length !== 1 ? 's' : ''}</>
                )}
            </p>
        </section>
    )
}

export default CategoryFilter

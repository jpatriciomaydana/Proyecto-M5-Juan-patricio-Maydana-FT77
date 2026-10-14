import { useEffect, useState } from "react";
import type { JSX } from "react";

import ProductCard from "../../components/products/ProductCard";
import { getProducts } from "../../services/productService";
import type { Product } from "../../types/product";
import "./Catalog.css";

function Catalog(): JSX.Element {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProducts() {
            try {
                const result = await getProducts();
                setProducts(result);
            } catch (error) {
                console.error("Error al cargar los productos:", error);
                setError("No pudimos cargar los libros. Intentá nuevamente.");
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

    if (loading) {
        return (
            <section className="catalog">
                <h1 className="catalog__title">Catálogo</h1>
                <p className="catalog__intro">Cargando libros...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="catalog">
                <h1 className="catalog__title">Catálogo</h1>
                <p role="alert" className="catalog__intro">
                    {error}
                </p>
            </section>
        );
    }

    return (
        <section className="catalog">
            <h1 className="catalog__title">Catálogo</h1>
            <p className="catalog__intro">Acá vas a encontrar nuestros libros.</p>

            {products.length === 0 ? (
                <p className="catalog__intro">
                    Todavía no hay libros disponibles.
                </p>
            ) : (
                <ul className="catalog__grid">
                    {products.map((product) => (
                        <li key={product.id}>
                            <ProductCard product={product} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default Catalog;
import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import type { Product } from "../../types/product";

function Catalog() {
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
            <section>
                <h1>Catálogo</h1>
                <p>Cargando libros...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section>
                <h1>Catálogo</h1>
                <p role="alert">{error}</p>
            </section>
        );
    }

    return (
        <section>
            <h1>Catálogo</h1>
            <p>Acá vas a encontrar nuestros libros.</p>

            {products.length === 0 ? (
                <p>Todavía no hay libros disponibles.</p>
            ) : (
                <ul>
                    {products.map((product) => (
                        <li key={product.id}>
                            <h2>{product.title}</h2>
                            <p>Autor: {product.author}</p>
                            <p>Precio: ${product.price}</p>
                            <p>Categoría: {product.categoryId}</p>
                            <p>Stock disponible: {product.stock}</p>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default Catalog;
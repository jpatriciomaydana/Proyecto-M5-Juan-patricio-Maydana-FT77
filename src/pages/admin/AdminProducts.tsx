import { useEffect, useState } from "react";
import type { JSX } from "react";
import { Link } from "react-router-dom";

import { getProducts } from "../../services/productService";
import type { Product } from "../../types/product";
import "./AdminProducts.css";

const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
});

function AdminProducts(): JSX.Element {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        getProducts()
            .then((data) => {
                if (!cancelled) {
                    setProducts(data);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setError(
                        "No pudimos cargar los productos. Intentá de nuevo en unos minutos."
                    );
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        // Si el usuario sale de la página antes de que responda Firestore,
        // evitamos actualizar el estado de un componente que ya no existe.
        return () => {
            cancelled = true;
        };
    }, []);

    const hasProducts = !loading && !error && products.length > 0;
    const isEmpty = !loading && !error && products.length === 0;

    return (
        <section className="admin-products">
            <div className="admin-products__header">
                <h1 className="admin-products__title">Productos</h1>

                <Link
                    to="/admin/productos/nuevo"
                    className="admin-products__new"
                >
                    Nuevo producto
                </Link>
            </div>

            {loading && (
                <p className="admin-products__message" role="status">
                    Cargando productos...
                </p>
            )}

            {error && (
                <p
                    className="admin-products__message admin-products__message--error"
                    role="alert"
                >
                    {error}
                </p>
            )}

            {isEmpty && (
                <p className="admin-products__message">
                    Todavía no hay productos cargados.
                </p>
            )}

            {hasProducts && (
                <>
                    <p className="admin-products__count">
                        {products.length}{" "}
                        {products.length === 1 ? "producto" : "productos"}
                    </p>

                    <table
                        className="admin-products__table"
                        aria-label="Listado de productos"
                    >
                        <thead>
                            <tr>
                                <th scope="col">Título</th>
                                <th scope="col">Categoría</th>
                                <th scope="col">Precio</th>
                                <th scope="col">Stock</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td className="admin-products__cell-title">
                                        <span className="admin-products__book-title">
                                            {product.title}
                                        </span>
                                        <span className="admin-products__book-author">
                                            {product.author}
                                        </span>
                                    </td>
                                    <td data-label="Categoría">
                                        {product.categoryId}
                                    </td>
                                    <td data-label="Precio">
                                        {priceFormatter.format(product.price)}
                                    </td>
                                    <td data-label="Stock">
                                        {product.stock > 0 ? (
                                            product.stock
                                        ) : (
                                            <span className="admin-products__stock--empty">
                                                Sin stock
                                            </span>
                                        )}
                                    </td>
                                    <td className="admin-products__cell-actions">
                                        <Link
                                            to={`/admin/productos/${product.id}/editar`}
                                            className="admin-products__edit"
                                            aria-label={`Editar ${product.title}`}
                                        >
                                            Editar
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </section>
    );
}

export default AdminProducts;
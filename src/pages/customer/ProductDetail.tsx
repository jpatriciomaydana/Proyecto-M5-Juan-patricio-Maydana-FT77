import { useEffect, useState } from "react";
import type { JSX } from "react";
import { Link, useParams } from "react-router-dom";

import { getProductById } from "../../services/productService";
import type { Product } from "../../types/product";
import "./ProductDetail.css";

const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
});

function ProductDetail(): JSX.Element {
    const { id } = useParams<{ id: string }>();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [imageFailed, setImageFailed] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadProduct(): Promise<void> {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                const result = await getProductById(id);
                if (!cancelled) {
                    setProduct(result);
                }
            } catch (err) {
                console.error("Error al cargar el producto:", err);
                if (!cancelled) {
                    setError("No pudimos cargar el libro. Intentá nuevamente.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadProduct();

        return () => {
            cancelled = true;
        };
    }, [id]);

    if (loading) {
        return (
            <section className="detail">
                <p>Cargando libro...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="detail">
                <p role="alert">{error}</p>
                <Link to="/catalogo" className="detail__back">
                    Volver al catálogo
                </Link>
            </section>
        );
    }

    if (!product) {
        return (
            <section className="detail">
                <h1 className="detail__title">Libro no encontrado</h1>
                <p>Es posible que el libro ya no esté disponible.</p>
                <Link to="/catalogo" className="detail__back">
                    Volver al catálogo
                </Link>
            </section>
        );
    }

    const hasImage = product.imageUrl.trim() !== "" && !imageFailed;
    const outOfStock = product.stock <= 0;

    return (
        <section className="detail">
            <Link to="/catalogo" className="detail__back">
                ← Volver al catálogo
            </Link>

            <div className="detail__layout">
                <div className="detail__media">
                    {hasImage ? (
                        <img
                            src={product.imageUrl}
                            alt={`Portada de ${product.title}`}
                            className="detail__image"
                            onError={() => setImageFailed(true)}
                        />
                    ) : (
                        <div className="detail__placeholder" aria-hidden="true">
                            <span>{product.title}</span>
                        </div>
                    )}
                </div>

                <div className="detail__info">
                    <p className="detail__category">{product.categoryId}</p>
                    <h1 className="detail__title">{product.title}</h1>
                    <p className="detail__author">{product.author}</p>

                    {product.firstEdition && (
                        <p className="detail__badge">Primera edición</p>
                    )}

                    <p className="detail__price">
                        {priceFormatter.format(product.price)}
                    </p>
                    <p className="detail__stock">
                        {outOfStock
                            ? "Sin stock"
                            : `Stock disponible: ${product.stock}`}
                    </p>

                    <p className="detail__description">{product.description}</p>

                    <dl className="detail__data">
                        <dt>ISBN</dt>
                        <dd>{product.isbn}</dd>
                        <dt>Editorial</dt>
                        <dd>{product.publisher}</dd>
                        <dt>Año de publicación</dt>
                        <dd>{product.publicationYear}</dd>
                    </dl>
                </div>
            </div>
        </section>
    );
}

export default ProductDetail;
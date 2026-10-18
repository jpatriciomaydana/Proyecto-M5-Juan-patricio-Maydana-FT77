import { useState } from "react";
import type { JSX } from "react";
import { Link } from "react-router-dom";

import { CartIcon } from "../../components/common/Icons";
import { useCart } from "../../hooks/useCart";
import type { CartItem } from "../../types/cart";
import "./Cart.css";

const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
});

interface CartRowProps {
    item: CartItem;
}

function CartRow({ item }: CartRowProps): JSX.Element {
    const { updateQuantity, removeItem } = useCart();
    const [imageFailed, setImageFailed] = useState(false);

    const { product, quantity } = item;
    const hasImage = product.imageUrl.trim() !== "" && !imageFailed;
    const atMaxStock = quantity >= product.stock;

    return (
        <li className="cart-item">
            <div className="cart-item__media">
                {hasImage ? (
                    <img
                        src={product.imageUrl}
                        alt={`Portada de ${product.title}`}
                        className="cart-item__image"
                        loading="lazy"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <div
                        className="cart-item__placeholder"
                        aria-hidden="true"
                    >
                        <span>{product.title}</span>
                    </div>
                )}
            </div>

            <div className="cart-item__info">
                <h2 className="cart-item__title">
                    <Link
                        to={`/catalogo/${product.id}`}
                        className="cart-item__link"
                    >
                        {product.title}
                    </Link>
                </h2>
                <p className="cart-item__author">{product.author}</p>
                <p className="cart-item__price">
                    {priceFormatter.format(product.price)} c/u
                </p>
            </div>

            <div className="cart-item__controls">
                <div
                    className="cart-item__qty"
                    role="group"
                    aria-label={`Cantidad de ${product.title}`}
                >
                    <button
                        type="button"
                        className="cart-item__qty-btn"
                        aria-label={`Quitar una unidad de ${product.title}`}
                        disabled={quantity <= 1}
                        onClick={() =>
                            updateQuantity(product.id, quantity - 1)
                        }
                    >
                        −
                    </button>

                    <span className="cart-item__qty-value">{quantity}</span>

                    <button
                        type="button"
                        className="cart-item__qty-btn"
                        aria-label={`Agregar una unidad de ${product.title}`}
                        disabled={atMaxStock}
                        onClick={() =>
                            updateQuantity(product.id, quantity + 1)
                        }
                    >
                        +
                    </button>
                </div>

                <p className="cart-item__subtotal">
                    {priceFormatter.format(product.price * quantity)}
                </p>

                <button
                    type="button"
                    className="cart-item__remove"
                    aria-label={`Quitar ${product.title} del carrito`}
                    onClick={() => removeItem(product.id)}
                >
                    Quitar
                </button>
            </div>

            {atMaxStock && (
                <p className="cart-item__note">
                    Llegaste al máximo disponible ({product.stock}).
                </p>
            )}
        </li>
    );
}

function Cart(): JSX.Element {
    const { items, total, itemCount, clearCart } = useCart();

    function handleClear(): void {
        if (window.confirm("¿Querés vaciar el carrito?")) {
            clearCart();
        }
    }

    if (items.length === 0) {
        return (
            <section className="cart-page">
                <h1 className="cart-page__title">Carrito</h1>

                <div className="cart-empty">
                    <span className="cart-empty__icon">
                        <CartIcon size={48} />
                    </span>
                    <p className="cart-empty__text">
                        Tu carrito está vacío.
                    </p>
                    <Link to="/catalogo" className="cart-empty__link">
                        Explorar el catálogo
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="cart-page">
            <h1 className="cart-page__title">Carrito</h1>

            <div className="cart-page__layout">
                <ul className="cart-page__list">
                    {items.map((item) => (
                        <CartRow key={item.product.id} item={item} />
                    ))}
                </ul>

                <aside className="cart-summary" aria-label="Resumen del carrito">
                    <h2 className="cart-summary__title">Resumen</h2>

                    <p className="cart-summary__row">
                        <span>
                            {itemCount}{" "}
                            {itemCount === 1 ? "producto" : "productos"}
                        </span>
                    </p>

                    <p className="cart-summary__total">
                        <span>Total</span>
                        <strong>{priceFormatter.format(total)}</strong>
                    </p>

                    <button
                        type="button"
                        className="cart-summary__clear"
                        onClick={handleClear}
                    >
                        Vaciar carrito
                    </button>
                </aside>
            </div>
        </section>
    );
}

export default Cart;
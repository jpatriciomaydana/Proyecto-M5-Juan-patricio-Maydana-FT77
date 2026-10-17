import { useEffect, useState } from "react";
import type { JSX } from "react";

import { useCart } from "../../hooks/useCart";
import type { Product } from "../../types/product";
import { CartIcon } from "../common/Icons";
import "./AddToCartButton.css";

interface AddToCartButtonProps {
    product: Product;
}

function AddToCartButton({ product }: AddToCartButtonProps): JSX.Element {
    const { addItem, getQuantity } = useCart();
    const [added, setAdded] = useState(false);

    // La confirmación dura 1,5 s. Al desmontar se cancela el temporizador.
    useEffect(() => {
        if (!added) {
            return;
        }

        const timeoutId = setTimeout(() => setAdded(false), 1500);

        return () => clearTimeout(timeoutId);
    }, [added]);

    const outOfStock = product.stock <= 0;
    const atMax = !outOfStock && getQuantity(product.id) >= product.stock;

    function handleClick(): void {
        addItem(product);
        setAdded(true);
    }

    let label = "Agregar";
    if (outOfStock) {
        label = "Sin stock";
    } else if (atMax) {
        label = "Todo en tu carrito";
    } else if (added) {
        label = "¡Agregado!";
    }

    return (
        <>
            <button
                type="button"
                className="add-to-cart"
                onClick={handleClick}
                disabled={outOfStock || atMax}
                aria-label={`${label}: ${product.title}`}
            >
                <CartIcon />
                <span>{label}</span>
            </button>
            <span className="add-to-cart__status" role="status">
                {added ? "Agregado al carrito" : ""}
            </span>
        </>
    );
}

export default AddToCartButton;
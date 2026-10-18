import type { JSX } from "react";
import { NavLink } from "react-router-dom";

import { useCart } from "../../hooks/useCart";
import { CartIcon } from "../common/Icons";
import "./CartLink.css";

interface CartLinkProps {
    onNavigate?: () => void;
}

function CartLink({ onNavigate }: CartLinkProps): JSX.Element {
    const { itemCount } = useCart();

    const countText = itemCount > 99 ? "99+" : String(itemCount);
    const label =
        itemCount === 0
            ? "Carrito"
            : `Carrito, ${itemCount} ${itemCount === 1 ? "producto" : "productos"}`;

    return (
        <NavLink
            to="/carrito"
            className="navbar__link cart-link"
            aria-label={label}
            onClick={onNavigate}
        >
            <span className="cart-link__icon">
                <CartIcon size={22} />
                {itemCount > 0 && (
                    <span className="cart-link__count" aria-hidden="true">
                        {countText}
                    </span>
                )}
            </span>
            <span className="cart-link__text">Carrito</span>
        </NavLink>
    );
}

export default CartLink;
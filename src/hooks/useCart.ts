import { useContext } from "react";

import { CartContext } from "../contexts/cartContextObject";
import type { CartContextType } from "../contexts/cartContextObject";

export function useCart(): CartContextType {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart debe utilizarse dentro de CartProvider");
    }

    return context;
}
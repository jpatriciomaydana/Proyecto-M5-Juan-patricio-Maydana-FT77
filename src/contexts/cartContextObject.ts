import { createContext } from "react";

import type { CartState } from "../types/cart";
import type { Product } from "../types/product";

export interface CartContextType extends CartState {
    itemCount: number;
    getQuantity: (productId: string) => number;
    addItem: (product: Product) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    removeItem: (productId: string) => void;
    clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(
    undefined,
);
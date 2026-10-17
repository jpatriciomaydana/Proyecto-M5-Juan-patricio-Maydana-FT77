import { useState } from "react";
import type { JSX, ReactNode } from "react";

import type { CartItem } from "../types/cart";
import type { Product } from "../types/product";
import { CartContext } from "./cartContextObject";

interface CartProviderProps {
    children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps): JSX.Element {
    const [items, setItems] = useState<CartItem[]>([]);

    // Valores derivados: se calculan en cada render a partir de items.
    const total = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
    );
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    function getQuantity(productId: string): number {
        const item = items.find((entry) => entry.product.id === productId);
        return item ? item.quantity : 0;
    }

    function addItem(product: Product): void {
        if (product.stock <= 0) {
            return;
        }

        setItems((prev) => {
            const existing = prev.find(
                (item) => item.product.id === product.id,
            );

            if (!existing) {
                return [...prev, { product, quantity: 1 }];
            }

            // Nunca superamos el stock del producto.
            const quantity = Math.min(existing.quantity + 1, product.stock);

            return prev.map((item) =>
                item.product.id === product.id
                    ? { ...item, quantity }
                    : item,
            );
        });
    }

    function updateQuantity(productId: string, quantity: number): void {
        const wanted = Math.floor(quantity);

        // Cantidad cero (o inválida): equivale a quitar el producto.
        if (!Number.isFinite(wanted) || wanted <= 0) {
            removeItem(productId);
            return;
        }

        setItems((prev) =>
            prev.map((item) =>
                item.product.id === productId
                    ? {
                        ...item,
                        quantity: Math.min(wanted, item.product.stock),
                    }
                    : item,
            ),
        );
    }

    function removeItem(productId: string): void {
        setItems((prev) =>
            prev.filter((item) => item.product.id !== productId),
        );
    }

    function clearCart(): void {
        setItems([]);
    }

    return (
        <CartContext.Provider
            value={{
                items,
                total,
                itemCount,
                getQuantity,
                addItem,
                updateQuantity,
                removeItem,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
import { useEffect, useRef, useState } from "react";
import type { JSX, ReactNode } from "react";

import { useAuthContext } from "../hooks/useAuthContext";
import {
    clearCartItems,
    getCartItems,
    parseCartLines,
    resolveCartLines,
    saveCartItems,
    toCartLines,
} from "../services/cartService";
import type { CartLine } from "../services/cartService";
import type { CartItem } from "../types/cart";
import type { Product } from "../types/product";
import { CartContext } from "./cartContextObject";

interface CartProviderProps {
    children: ReactNode;
}

const GUEST_KEY = "libreria-cart-guest";
const OLD_KEY = "libreria-cart";
const SAVE_DELAY_MS = 400;

// Lee el carrito del invitado. Cualquier dato inválido se descarta:
// localStorage lo puede editar cualquiera, así que no se confía en él.
function readGuestLines(): CartLine[] {
    try {
        const raw = localStorage.getItem(GUEST_KEY);

        if (!raw) {
            return [];
        }

        return parseCartLines(JSON.parse(raw));
    } catch {
        return [];
    }
}

function writeGuestLines(lines: CartLine[]): void {
    try {
        localStorage.setItem(GUEST_KEY, JSON.stringify(lines));
    } catch {
        // Sin espacio o almacenamiento bloqueado: el carrito sigue en memoria.
    }
}

function removeGuestLines(): void {
    try {
        localStorage.removeItem(GUEST_KEY);
    } catch {
        // Nada que hacer si el almacenamiento está bloqueado.
    }
}

// Une el carrito de la cuenta con el del invitado: suma cantidades
// y nunca supera el stock del libro.
function mergeItems(account: CartItem[], guest: CartItem[]): CartItem[] {
    const merged = new Map<string, CartItem>();

    for (const item of account) {
        merged.set(item.product.id, item);
    }

    for (const item of guest) {
        const existing = merged.get(item.product.id);

        if (!existing) {
            merged.set(item.product.id, item);
            continue;
        }

        merged.set(item.product.id, {
            product: existing.product,
            quantity: Math.min(
                existing.quantity + item.quantity,
                existing.product.stock,
            ),
        });
    }

    return Array.from(merged.values());
}

interface LoadResult {
    items: CartItem[];
    ok: boolean;
}

// Carga el carrito del dueño actual. Invitado: desde localStorage.
// Cuenta: desde Firestore, fusionando el carrito del invitado si lo hay.
// Si algo falla devuelve un carrito vacío con ok en false.
async function loadCart(uid: string | null): Promise<LoadResult> {
    try {
        const guestLines = readGuestLines();

        if (!uid) {
            return { items: await resolveCartLines(guestLines), ok: true };
        }

        const accountItems = await getCartItems(uid);

        if (guestLines.length === 0) {
            return { items: accountItems, ok: true };
        }

        const guestItems = await resolveCartLines(guestLines);
        const merged = mergeItems(accountItems, guestItems);

        await saveCartItems(uid, merged);
        removeGuestLines();

        return { items: merged, ok: true };
    } catch (error) {
        console.error("Error al cargar el carrito:", error);
        return { items: [], ok: false };
    }
}

export function CartProvider({ children }: CartProviderProps): JSX.Element {
    const { user, loading: authLoading } = useAuthContext();

    const uid = user?.uid ?? null;
    const ownerKey = uid ?? "guest";

    const [items, setItems] = useState<CartItem[]>([]);
    // De quién es el carrito que hay en "items" (uid o "guest").
    const [loadedOwner, setLoadedOwner] = useState<string | null>(null);

    // Solo se guarda si la última lectura salió bien: un error de red
    // nunca debe pisar el carrito real con uno vacío.
    const canSave = useRef(false);
    // Lo último que se guardó (o se leyó), para no escribir lo mismo dos veces.
    const lastSaved = useRef("[]");

    // El carrito está cargando mientras la autenticación carga
    // o mientras "items" pertenezca a otro dueño.
    const loading = authLoading || loadedOwner !== ownerKey;

    // Limpieza única de la clave vieja (guardaba el libro entero).
    useEffect(() => {
        try {
            localStorage.removeItem(OLD_KEY);
        } catch {
            // Nada que hacer si el almacenamiento está bloqueado.
        }
    }, []);

    // Carga al cambiar de dueño (invitado <-> cuenta).
    useEffect(() => {
        if (authLoading) {
            return;
        }

        let cancelled = false;

        void loadCart(uid).then((result) => {
            if (cancelled) {
                return;
            }

            canSave.current = result.ok;
            lastSaved.current = JSON.stringify(toCartLines(result.items));
            setItems(result.items);
            setLoadedOwner(ownerKey);
        });

        return () => {
            cancelled = true;
        };
    }, [authLoading, uid, ownerKey]);

    // Guardado con espera: cada cambio reinicia el temporizador y solo
    // se escribe cuando pasan 400 ms sin cambios.
    useEffect(() => {
        if (loading || !canSave.current) {
            return;
        }

        const lines = toCartLines(items);
        const serialized = JSON.stringify(lines);

        if (serialized === lastSaved.current) {
            return;
        }

        const timer = setTimeout(() => {
            lastSaved.current = serialized;

            if (!uid) {
                writeGuestLines(lines);
                return;
            }

            const request =
                lines.length === 0
                    ? clearCartItems(uid)
                    : saveCartItems(uid, items);

            request.catch((error: unknown) => {
                console.error("Error al guardar el carrito:", error);
            });
        }, SAVE_DELAY_MS);

        return () => {
            clearTimeout(timer);
        };
    }, [items, loading, uid]);

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
        if (loading || product.stock <= 0) {
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
        if (loading) {
            return;
        }

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
        if (loading) {
            return;
        }

        setItems((prev) =>
            prev.filter((item) => item.product.id !== productId),
        );
    }

    function clearCart(): void {
        if (loading) {
            return;
        }

        setItems([]);
    }

    return (
        <CartContext.Provider
            value={{
                items,
                total,
                itemCount,
                loading,
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
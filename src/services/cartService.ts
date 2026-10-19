import {
    deleteDoc,
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";

import { db } from "./firebase";
import { getProductById } from "./productService";
import type { CartItem } from "../types/cart";

// Lo único que se guarda de cada ítem: qué libro y cuántas unidades.
// Precio y stock se vuelven a leer de "products" al cargar.
export interface CartLine {
    productId: string;
    quantity: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

// Convierte datos de origen no confiable (Firestore o localStorage)
// en líneas válidas. Lo inválido se descarta y los repetidos se suman.
export function parseCartLines(raw: unknown): CartLine[] {
    if (!Array.isArray(raw)) {
        return [];
    }

    const quantities = new Map<string, number>();

    for (const entry of raw) {
        if (!isRecord(entry)) {
            continue;
        }

        const { productId, quantity } = entry;

        if (typeof productId !== "string" || productId === "") {
            continue;
        }

        if (typeof quantity !== "number" || !Number.isFinite(quantity)) {
            continue;
        }

        const whole = Math.floor(quantity);

        if (whole <= 0) {
            continue;
        }

        quantities.set(productId, (quantities.get(productId) ?? 0) + whole);
    }

    return Array.from(quantities, ([productId, quantity]) => ({
        productId,
        quantity,
    }));
}

export function toCartLines(items: CartItem[]): CartLine[] {
    return items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
    }));
}

// Relee cada libro desde Firestore. Un libro borrado o sin stock se descarta
// y la cantidad nunca supera el stock actual.
export async function resolveCartLines(lines: CartLine[]): Promise<CartItem[]> {
    const resolved = await Promise.all(
        lines.map(async (line): Promise<CartItem | null> => {
            const product = await getProductById(line.productId);

            if (!product || product.stock <= 0) {
                return null;
            }

            return {
                product,
                quantity: Math.min(line.quantity, product.stock),
            };
        }),
    );

    return resolved.filter((item): item is CartItem => item !== null);
}

export async function getCartItems(uid: string): Promise<CartItem[]> {
    const cartRef = doc(db, "carts", uid);
    const snapshot = await getDoc(cartRef);

    if (!snapshot.exists()) {
        return [];
    }

    const lines = parseCartLines(snapshot.data().items);

    return resolveCartLines(lines);
}

// updatedAt lo pone el servidor: la regla exige que sea igual a request.time.
export async function saveCartItems(
    uid: string,
    items: CartItem[],
): Promise<void> {
    const cartRef = doc(db, "carts", uid);

    await setDoc(cartRef, {
        items: toCartLines(items),
        updatedAt: serverTimestamp(),
    });
}

export async function clearCartItems(uid: string): Promise<void> {
    const cartRef = doc(db, "carts", uid);

    await deleteDoc(cartRef);
}
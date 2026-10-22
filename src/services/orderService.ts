import { auth } from "./firebase";
import { saveCartItems } from "./cartService";
import type { CartItem } from "../types/cart";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

// Confirma la compra. El navegador NO manda el carrito: manda solo su token
// de sesión y la función serverless lee el carrito desde Firestore.
// Por eso antes se guarda el carrito de la pantalla (si no, el guardado con
// espera podría dejar al servidor con una versión vieja).
export async function createOrder(items: CartItem[]): Promise<string> {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        throw new Error("Tenés que iniciar sesión para comprar.");
    }

    await saveCartItems(currentUser.uid, items);

    const token = await currentUser.getIdToken();

    let response: Response;

    try {
        response = await fetch("/api/create-order", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch {
        throw new Error(
            "No pudimos conectarnos con el servidor. Revisá tu conexión e intentá de nuevo.",
        );
    }

    // Si la respuesta no es JSON (por ejemplo, una caída de la función),
    // data queda en null y se usa un mensaje genérico.
    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
        const message =
            isRecord(data) && typeof data.error === "string"
                ? data.error
                : "No se pudo completar la compra. Intentá de nuevo.";

        throw new Error(message);
    }

    if (!isRecord(data) || typeof data.orderId !== "string") {
        throw new Error("Respuesta inesperada del servidor.");
    }

    return data.orderId;
}
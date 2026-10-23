import type { OrderStatus } from "../types/order";

// Los valores guardados en Firestore siguen en inglés; esto es solo el texto
// que se ve en pantalla. Lo usan "Mis pedidos" y la vista de administración.
export const STATUS_LABELS: Record<OrderStatus, string> = {
    pending: "Pendiente",
    processing: "En proceso",
    completed: "Completado",
    cancelled: "Cancelado",
};

// Lista ordenada de estados, para armar el filtro del admin.
export const ORDER_STATUSES: OrderStatus[] = [
    "pending",
    "processing",
    "completed",
    "cancelled",
];

const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
});

export function formatPrice(value: number): string {
    return priceFormatter.format(value);
}

export function formatDate(date: Date): string {
    return date.toLocaleString("es-AR", {
        dateStyle: "long",
        timeStyle: "short",
    });
}
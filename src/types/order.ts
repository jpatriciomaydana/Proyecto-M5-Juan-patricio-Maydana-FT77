export interface OrderItem {
    productId: string;
    title: string;
    price: number;
    quantity: number;
}

export type OrderStatus =
    | "pending"
    | "processing"
    | "completed"
    | "cancelled";

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    createdAt: Date;
}
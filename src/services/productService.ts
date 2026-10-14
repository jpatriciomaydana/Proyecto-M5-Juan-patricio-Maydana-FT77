import {
    collection,
    getDocs,
    orderBy,
    query,
    Timestamp,
} from "firebase/firestore";

import { db } from "./firebase";
import type { Product } from "../types/product";

export async function getProducts(): Promise<Product[]> {
    const productsRef = collection(db, "products");
    const productsQuery = query(
        productsRef,
        orderBy("title", "asc")
    );

    const snapshot = await getDocs(productsQuery);

    return snapshot.docs.map((document) => {
        const data = document.data();

        const createdAt =
            data.createdAt instanceof Timestamp
                ? data.createdAt.toDate()
                : new Date(0);

        return {
            ...(data as Omit<Product, "id" | "createdAt">),
            id: document.id,
            createdAt,
        };
    });
}
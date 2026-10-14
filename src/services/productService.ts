import {
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    Timestamp,
} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";

import { db } from "./firebase";
import type { Product } from "../types/product";

function toProduct(id: string, data: DocumentData): Product {
    const createdAt =
        data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : new Date(0);

    return {
        ...(data as Omit<Product, "id" | "createdAt">),
        id,
        createdAt,
    };
}

export async function getProducts(): Promise<Product[]> {
    const productsRef = collection(db, "products");
    const productsQuery = query(productsRef, orderBy("title", "asc"));

    const snapshot = await getDocs(productsQuery);

    return snapshot.docs.map((document) =>
        toProduct(document.id, document.data())
    );
}

export async function getProductById(id: string): Promise<Product | null> {
    const productRef = doc(db, "products", id);
    const snapshot = await getDoc(productRef);

    if (!snapshot.exists()) {
        return null;
    }

    return toProduct(snapshot.id, snapshot.data());
}
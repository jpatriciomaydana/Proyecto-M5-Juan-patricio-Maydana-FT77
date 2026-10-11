import {
    collection,
    getDocs,
    orderBy,
    query,
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

    return snapshot.docs.map((document) => ({
        ...document.data(),
        id: document.id,
    })) as Product[];
}


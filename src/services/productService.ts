import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";

import { db } from "./firebase";
import type { Product, ProductInput } from "../types/product";

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

// Crea un producto y devuelve el id que le asignó Firestore.
// createdAt lo pone el servidor, no el navegador.
export async function createProduct(input: ProductInput): Promise<string> {
    const productsRef = collection(db, "products");

    const created = await addDoc(productsRef, {
        ...input,
        createdAt: serverTimestamp(),
    });

    return created.id;
}

// Actualiza solo los campos del formulario. No toca createdAt.
export async function updateProduct(
    id: string,
    input: ProductInput
): Promise<void> {
    const productRef = doc(db, "products", id);

    await updateDoc(productRef, { ...input });
}

export async function deleteProduct(id: string): Promise<void> {
    const productRef = doc(db, "products", id);

    await deleteDoc(productRef);
}
export type CategoryId = "Terror" | "Novela" | "Fantasía" | "Ciencia Ficción" | "Clásicos";

export interface Product {
    id: string;
    title: string;
    author: string;
    description: string;
    price: number;
    categoryId: CategoryId;
    stock: number;
    imageUrl: string;
    isbn: string;
    publisher: string;
    publicationYear: number;
    firstEdition: boolean;
    createdAt: Date;
}

// Datos que carga el formulario de administración: todo menos lo que
// asigna el sistema (el id lo genera Firestore y createdAt el servidor).
export type ProductInput = Omit<Product, "id" | "createdAt">;
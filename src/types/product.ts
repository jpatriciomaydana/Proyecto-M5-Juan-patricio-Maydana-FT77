export type CategoryId = "Terror" | "Novela" | "Fantasía" | "Ciencia Ficción" | "clasicos";

export interface Product {
    id: string;
    title: string;
    author: string;
    description: string;
    price: number;
    categoryId: CategoryId;
    stock: number;
    imageUrl: string;
    isbn: number;
    publisher: string;
    publicationYear: number;
    firstEdition: boolean;
    createdAt: Date;
}
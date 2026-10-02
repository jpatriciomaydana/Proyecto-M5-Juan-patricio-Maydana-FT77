export interface Product {
    id: string;
    title: string;
    author: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    imageUrl: string;
    isbn: number;
    publisher: string;
    publicationYear: number;
    firstEdition: boolean;
    createdAt: Date;
}
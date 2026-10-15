import "dotenv/config";
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const projectId = process.env.VITE_FIREBASE_PROJECT_ID;

if (!projectId) {
    throw new Error("Falta VITE_FIREBASE_PROJECT_ID en el archivo .env.");
}

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error("Falta GOOGLE_APPLICATION_CREDENTIALS en el archivo .env.");
}

initializeApp({
    credential: applicationDefault(),
    projectId,
});

const db = getFirestore();

type CategoryId =
    | "Terror"
    | "Novela"
    | "Fantasía"
    | "Ciencia Ficción"
    | "Clásicos";

interface SeedProduct {
    id: string;
    title: string;
    author: string;
    description: string;
    price: number;
    categoryId: CategoryId;
    stock: number;
    isbn: string;
    publisher: string;
    publicationYear: number;
    firstEdition: boolean;
}

const BOOKS: SeedProduct[] = [
    // TERROR
    { id: "terror-dracula", title: "Drácula", author: "Bram Stoker", description: "La clásica historia del conde Drácula.", price: 18000, categoryId: "Terror", stock: 8, isbn: "DEMO-0001", publisher: "Edición de demostración", publicationYear: 1897, firstEdition: true },
    { id: "terror-frankenstein", title: "Frankenstein", author: "Mary Shelley", description: "Un científico crea una criatura que cambiará su vida.", price: 17500, categoryId: "Terror", stock: 7, isbn: "DEMO-0002", publisher: "Edición de demostración", publicationYear: 1818, firstEdition: false },
    { id: "terror-it", title: "It", author: "Stephen King", description: "Un grupo de amigos enfrenta una presencia aterradora.", price: 26000, categoryId: "Terror", stock: 5, isbn: "DEMO-0003", publisher: "Edición de demostración", publicationYear: 1986, firstEdition: false },
    { id: "terror-carrie", title: "Carrie", author: "Stephen King", description: "Una joven descubre el alcance de sus poderes.", price: 19000, categoryId: "Terror", stock: 6, isbn: "DEMO-0004", publisher: "Edición de demostración", publicationYear: 1974, firstEdition: false },
    { id: "terror-exorcista", title: "El exorcista", author: "William Peter Blatty", description: "Una historia inquietante de posesión y misterio.", price: 20000, categoryId: "Terror", stock: 4, isbn: "DEMO-0005", publisher: "Edición de demostración", publicationYear: 1971, firstEdition: false },
    { id: "terror-rebecca", title: "Rebecca", author: "Daphne du Maurier", description: "Secretos y misterio en una antigua mansión.", price: 18500, categoryId: "Terror", stock: 6, isbn: "DEMO-0006", publisher: "Edición de demostración", publicationYear: 1938, firstEdition: false },
    { id: "terror-carmilla", title: "Carmilla", author: "Sheridan Le Fanu", description: "Un relato gótico de vampiros y secretos.", price: 15000, categoryId: "Terror", stock: 0, isbn: "DEMO-0007", publisher: "Edición de demostración", publicationYear: 1872, firstEdition: false },
    { id: "terror-otra-vuelta", title: "Otra vuelta de tuerca", author: "Henry James", description: "Una institutriz descubre sucesos inexplicables.", price: 15500, categoryId: "Terror", stock: 5, isbn: "DEMO-0008", publisher: "Edición de demostración", publicationYear: 1898, firstEdition: false },
    { id: "terror-llamada-cthulhu", title: "La llamada de Cthulhu", author: "H. P. Lovecraft", description: "Un misterio cósmico que desafía la razón.", price: 17000, categoryId: "Terror", stock: 8, isbn: "DEMO-0009", publisher: "Edición de demostración", publicationYear: 1928, firstEdition: false },
    { id: "terror-casa-usher", title: "La caída de la casa Usher", author: "Edgar Allan Poe", description: "Un inquietante relato gótico de Poe.", price: 14500, categoryId: "Terror", stock: 10, isbn: "DEMO-0010", publisher: "Edición de demostración", publicationYear: 1839, firstEdition: false },
    { id: "terror-semilla", title: "La semilla del diablo", author: "Ira Levin", description: "Una mujer sospecha que algo terrible sucede a su alrededor.", price: 19500, categoryId: "Terror", stock: 4, isbn: "DEMO-0011", publisher: "Edición de demostración", publicationYear: 1967, firstEdition: false },
    { id: "terror-misery", title: "Misery", author: "Stephen King", description: "Un escritor queda atrapado bajo el cuidado de una admiradora.", price: 22000, categoryId: "Terror", stock: 5, isbn: "DEMO-0012", publisher: "Edición de demostración", publicationYear: 1987, firstEdition: false },

    // NOVELA
    { id: "novela-orgullo-y-prejuicio", title: "Orgullo y prejuicio", author: "Jane Austen", description: "Amor, relaciones y convenciones sociales.", price: 16000, categoryId: "Novela", stock: 10, isbn: "DEMO-0013", publisher: "Edición de demostración", publicationYear: 1813, firstEdition: false },
    { id: "novela-cien-anos", title: "Cien años de soledad", author: "Gabriel García Márquez", description: "La historia de la familia Buendía en Macondo.", price: 24000, categoryId: "Novela", stock: 7, isbn: "DEMO-0014", publisher: "Edición de demostración", publicationYear: 1967, firstEdition: false },
    { id: "novela-el-alquimista", title: "El alquimista", author: "Paulo Coelho", description: "Un joven pastor persigue sus sueños.", price: 18500, categoryId: "Novela", stock: 9, isbn: "DEMO-0015", publisher: "Edición de demostración", publicationYear: 1988, firstEdition: false },
    { id: "novela-rayuela", title: "Rayuela", author: "Julio Cortázar", description: "Una novela experimental sobre el amor y la búsqueda.", price: 23000, categoryId: "Novela", stock: 4, isbn: "DEMO-0016", publisher: "Edición de demostración", publicationYear: 1963, firstEdition: false },
    { id: "novela-cometas", title: "Cometas en el cielo", author: "Khaled Hosseini", description: "Amistad, culpa y redención a lo largo de los años.", price: 21000, categoryId: "Novela", stock: 6, isbn: "DEMO-0017", publisher: "Edición de demostración", publicationYear: 2003, firstEdition: false },
    { id: "novela-pequenas-mujeres", title: "Mujercitas", author: "Louisa May Alcott", description: "Cuatro hermanas crecen y descubren su lugar en el mundo.", price: 17500, categoryId: "Novela", stock: 8, isbn: "DEMO-0018", publisher: "Edición de demostración", publicationYear: 1868, firstEdition: false },
    { id: "novela-cumbres", title: "Cumbres borrascosas", author: "Emily Brontë", description: "Una historia intensa de pasión y venganza.", price: 17000, categoryId: "Novela", stock: 6, isbn: "DEMO-0019", publisher: "Edición de demostración", publicationYear: 1847, firstEdition: false },
    { id: "novela-el-gran-gatsby", title: "El gran Gatsby", author: "F. Scott Fitzgerald", description: "Lujo, ambición y sueños en los años veinte.", price: 16500, categoryId: "Novela", stock: 7, isbn: "DEMO-0020", publisher: "Edición de demostración", publicationYear: 1925, firstEdition: false },
    { id: "novela-matar-ruisenor", title: "Matar a un ruiseñor", author: "Harper Lee", description: "Justicia y prejuicios en el sur de Estados Unidos.", price: 19500, categoryId: "Novela", stock: 0, isbn: "DEMO-0021", publisher: "Edición de demostración", publicationYear: 1960, firstEdition: false },
    { id: "novela-como-agua", title: "Como agua para chocolate", author: "Laura Esquivel", description: "Amor y tradiciones familiares unidos por la cocina.", price: 18000, categoryId: "Novela", stock: 6, isbn: "DEMO-0022", publisher: "Edición de demostración", publicationYear: 1989, firstEdition: false },
    { id: "novela-la-sombra-viento", title: "La sombra del viento", author: "Carlos Ruiz Zafón", description: "Un libro misterioso conduce a un secreto literario.", price: 22500, categoryId: "Novela", stock: 5, isbn: "DEMO-0023", publisher: "Edición de demostración", publicationYear: 2001, firstEdition: false },
    { id: "novela-casa-espiritus", title: "La casa de los espíritus", author: "Isabel Allende", description: "Una saga familiar marcada por la historia y lo extraordinario.", price: 22000, categoryId: "Novela", stock: 5, isbn: "DEMO-0024", publisher: "Edición de demostración", publicationYear: 1982, firstEdition: false },

    // FANTASÍA
    { id: "fantasia-el-hobbit", title: "El hobbit", author: "J. R. R. Tolkien", description: "Bilbo Bolsón emprende una aventura inesperada.", price: 22000, categoryId: "Fantasía", stock: 6, isbn: "DEMO-0025", publisher: "Edición de demostración", publicationYear: 1937, firstEdition: true },
    { id: "fantasia-harry-potter", title: "Harry Potter y la piedra filosofal", author: "J. K. Rowling", description: "Un joven descubre que pertenece al mundo mágico.", price: 24000, categoryId: "Fantasía", stock: 10, isbn: "DEMO-0026", publisher: "Edición de demostración", publicationYear: 1997, firstEdition: false },
    { id: "fantasia-senor-anillos", title: "La comunidad del anillo", author: "J. R. R. Tolkien", description: "Comienza el viaje para destruir el Anillo Único.", price: 26000, categoryId: "Fantasía", stock: 5, isbn: "DEMO-0027", publisher: "Edición de demostración", publicationYear: 1954, firstEdition: false },
    { id: "fantasia-narnia", title: "El león, la bruja y el ropero", author: "C. S. Lewis", description: "Cuatro hermanos descubren el mundo de Narnia.", price: 19500, categoryId: "Fantasía", stock: 7, isbn: "DEMO-0028", publisher: "Edición de demostración", publicationYear: 1950, firstEdition: false },
    { id: "fantasia-juego-tronos", title: "Juego de tronos", author: "George R. R. Martin", description: "Familias nobles luchan por el poder en Poniente.", price: 28000, categoryId: "Fantasía", stock: 4, isbn: "DEMO-0029", publisher: "Edición de demostración", publicationYear: 1996, firstEdition: false },
    { id: "fantasia-nombre-viento", title: "El nombre del viento", author: "Patrick Rothfuss", description: "Un músico relata la historia de su vida extraordinaria.", price: 27000, categoryId: "Fantasía", stock: 5, isbn: "DEMO-0030", publisher: "Edición de demostración", publicationYear: 2007, firstEdition: false },
    { id: "fantasia-tiempo", title: "Una arruga en el tiempo", author: "Madeleine L'Engle", description: "Una aventura a través del espacio y el tiempo.", price: 18500, categoryId: "Fantasía", stock: 6, isbn: "DEMO-0031", publisher: "Edición de demostración", publicationYear: 1962, firstEdition: false },
    { id: "fantasia-ocean", title: "El océano al final del camino", author: "Neil Gaiman", description: "Recuerdos de infancia se mezclan con lo sobrenatural.", price: 20500, categoryId: "Fantasía", stock: 5, isbn: "DEMO-0032", publisher: "Edición de demostración", publicationYear: 2013, firstEdition: false },
    { id: "fantasia-coraline", title: "Coraline", author: "Neil Gaiman", description: "Una niña encuentra una inquietante versión de su hogar.", price: 17000, categoryId: "Fantasía", stock: 8, isbn: "DEMO-0033", publisher: "Edición de demostración", publicationYear: 2002, firstEdition: false },
    { id: "fantasia-princesa-prometida", title: "La princesa prometida", author: "William Goldman", description: "Aventura, humor, amor y espadachines.", price: 19000, categoryId: "Fantasía", stock: 6, isbn: "DEMO-0034", publisher: "Edición de demostración", publicationYear: 1973, firstEdition: false },
    { id: "fantasia-tierras-mar", title: "Un mago de Terramar", author: "Ursula K. Le Guin", description: "Un aprendiz de mago descubre el precio del poder.", price: 21000, categoryId: "Fantasía", stock: 4, isbn: "DEMO-0035", publisher: "Edición de demostración", publicationYear: 1968, firstEdition: false },
    { id: "fantasia-american-gods", title: "American Gods", author: "Neil Gaiman", description: "Los dioses antiguos caminan entre los seres humanos.", price: 25000, categoryId: "Fantasía", stock: 4, isbn: "DEMO-0036", publisher: "Edición de demostración", publicationYear: 2001, firstEdition: false },

    // CIENCIA FICCIÓN
    { id: "ciencia-ficcion-fahrenheit-451", title: "Fahrenheit 451", author: "Ray Bradbury", description: "Una sociedad donde los libros están prohibidos.", price: 19000, categoryId: "Ciencia Ficción", stock: 7, isbn: "DEMO-0037", publisher: "Edición de demostración", publicationYear: 1953, firstEdition: false },
    { id: "ciencia-ficcion-dune", title: "Dune", author: "Frank Herbert", description: "Intrigas políticas y supervivencia en un planeta desértico.", price: 28000, categoryId: "Ciencia Ficción", stock: 5, isbn: "DEMO-0038", publisher: "Edición de demostración", publicationYear: 1965, firstEdition: true },
    { id: "ciencia-ficcion-1984", title: "1984", author: "George Orwell", description: "Una sociedad vigilada por un régimen totalitario.", price: 18000, categoryId: "Ciencia Ficción", stock: 9, isbn: "DEMO-0039", publisher: "Edición de demostración", publicationYear: 1949, firstEdition: false },
    { id: "ciencia-ficcion-fundacion", title: "Fundación", author: "Isaac Asimov", description: "Un plan busca preservar el conocimiento de la humanidad.", price: 23000, categoryId: "Ciencia Ficción", stock: 5, isbn: "DEMO-0040", publisher: "Edición de demostración", publicationYear: 1951, firstEdition: false },
    { id: "ciencia-ficcion-un-mundo-feliz", title: "Un mundo feliz", author: "Aldous Huxley", description: "Una sociedad futurista cuestiona la libertad individual.", price: 17500, categoryId: "Ciencia Ficción", stock: 7, isbn: "DEMO-0041", publisher: "Edición de demostración", publicationYear: 1932, firstEdition: false },
    { id: "ciencia-ficcion-martian", title: "El marciano", author: "Andy Weir", description: "Un astronauta intenta sobrevivir solo en Marte.", price: 22500, categoryId: "Ciencia Ficción", stock: 5, isbn: "DEMO-0042", publisher: "Edición de demostración", publicationYear: 2011, firstEdition: false },
    { id: "ciencia-ficcion-juego-ender", title: "El juego de Ender", author: "Orson Scott Card", description: "Un niño es entrenado para una posible guerra espacial.", price: 21000, categoryId: "Ciencia Ficción", stock: 6, isbn: "DEMO-0043", publisher: "Edición de demostración", publicationYear: 1985, firstEdition: false },
    { id: "ciencia-ficcion-solaris", title: "Solaris", author: "Stanisław Lem", description: "Una estación espacial estudia un océano alienígena.", price: 19500, categoryId: "Ciencia Ficción", stock: 4, isbn: "DEMO-0044", publisher: "Edición de demostración", publicationYear: 1961, firstEdition: false },
    { id: "ciencia-ficcion-neuromante", title: "Neuromante", author: "William Gibson", description: "Un hacker se adentra en un mundo de inteligencia artificial.", price: 22000, categoryId: "Ciencia Ficción", stock: 5, isbn: "DEMO-0045", publisher: "Edición de demostración", publicationYear: 1984, firstEdition: false },
    { id: "ciencia-ficcion-contacto", title: "Contacto", author: "Carl Sagan", description: "Una señal extraterrestre abre nuevas preguntas para la humanidad.", price: 20000, categoryId: "Ciencia Ficción", stock: 5, isbn: "DEMO-0046", publisher: "Edición de demostración", publicationYear: 1985, firstEdition: false },
    { id: "ciencia-ficcion-odisea", title: "2001: Una odisea del espacio", author: "Arthur C. Clarke", description: "Un viaje espacial revela un misterio ancestral.", price: 20500, categoryId: "Ciencia Ficción", stock: 6, isbn: "DEMO-0047", publisher: "Edición de demostración", publicationYear: 1968, firstEdition: false },
    { id: "ciencia-ficcion-el-fin-eternidad", title: "El fin de la eternidad", author: "Isaac Asimov", description: "Una organización interviene en la historia mediante viajes temporales.", price: 19000, categoryId: "Ciencia Ficción", stock: 5, isbn: "DEMO-0048", publisher: "Edición de demostración", publicationYear: 1955, firstEdition: false },

    // CLÁSICOS
    { id: "clasicos-don-quijote", title: "Don Quijote de la Mancha", author: "Miguel de Cervantes", description: "Las aventuras del ingenioso hidalgo y Sancho Panza.", price: 25000, categoryId: "Clásicos", stock: 4, isbn: "DEMO-0049", publisher: "Edición de demostración", publicationYear: 1605, firstEdition: false },
    { id: "clasicos-principito", title: "El principito", author: "Antoine de Saint-Exupéry", description: "Un viaje que invita a mirar el mundo con otros ojos.", price: 14000, categoryId: "Clásicos", stock: 12, isbn: "DEMO-0050", publisher: "Edición de demostración", publicationYear: 1943, firstEdition: false },
    { id: "clasicos-crimen-castigo", title: "Crimen y castigo", author: "Fiódor Dostoyevski", description: "Un estudiante enfrenta las consecuencias de sus decisiones.", price: 22000, categoryId: "Clásicos", stock: 5, isbn: "DEMO-0051", publisher: "Edición de demostración", publicationYear: 1866, firstEdition: false },
    { id: "clasicos-metamorfosis", title: "La metamorfosis", author: "Franz Kafka", description: "Un hombre despierta convertido en una criatura extraña.", price: 14500, categoryId: "Clásicos", stock: 10, isbn: "DEMO-0052", publisher: "Edición de demostración", publicationYear: 1915, firstEdition: false },
    { id: "clasicos-divina-comedia", title: "La divina comedia", author: "Dante Alighieri", description: "Un viaje literario por el Infierno, el Purgatorio y el Paraíso.", price: 26000, categoryId: "Clásicos", stock: 3, isbn: "DEMO-0053", publisher: "Edición de demostración", publicationYear: 1321, firstEdition: false },
    { id: "clasicos-conde-montecristo", title: "El conde de Montecristo", author: "Alexandre Dumas", description: "Una historia de traición, escape y venganza.", price: 24000, categoryId: "Clásicos", stock: 5, isbn: "DEMO-0054", publisher: "Edición de demostración", publicationYear: 1844, firstEdition: false },
    { id: "clasicos-moby-dick", title: "Moby Dick", author: "Herman Melville", description: "La obsesiva búsqueda de una gran ballena blanca.", price: 21000, categoryId: "Clásicos", stock: 4, isbn: "DEMO-0055", publisher: "Edición de demostración", publicationYear: 1851, firstEdition: false },
    { id: "clasicos-ana-karenina", title: "Ana Karenina", author: "León Tolstói", description: "Amor y sociedad en la Rusia del siglo XIX.", price: 24500, categoryId: "Clásicos", stock: 4, isbn: "DEMO-0056", publisher: "Edición de demostración", publicationYear: 1878, firstEdition: false },
    { id: "clasicos-iliada", title: "La Ilíada", author: "Homero", description: "El poema épico de la guerra de Troya.", price: 20000, categoryId: "Clásicos", stock: 6, isbn: "DEMO-0057", publisher: "Edición de demostración", publicationYear: -750, firstEdition: false },
    { id: "clasicos-jane-eyre", title: "Jane Eyre", author: "Charlotte Brontë", description: "La vida de una joven que busca independencia y amor.", price: 18000, categoryId: "Clásicos", stock: 6, isbn: "DEMO-0058", publisher: "Edición de demostración", publicationYear: 1847, firstEdition: false },
    { id: "clasicos-guerra-paz", title: "Guerra y paz", author: "León Tolstói", description: "Una saga sobre familias y conflictos durante las guerras napoleónicas.", price: 29000, categoryId: "Clásicos", stock: 3, isbn: "DEMO-0059", publisher: "Edición de demostración", publicationYear: 1869, firstEdition: false },
    { id: "clasicos-isla-tesoro", title: "La isla del tesoro", author: "Robert Louis Stevenson", description: "Una aventura de piratas, mapas y tesoros escondidos.", price: 16500, categoryId: "Clásicos", stock: 8, isbn: "DEMO-0060", publisher: "Edición de demostración", publicationYear: 1883, firstEdition: false },
];

function createCoverUrl(title: string): string {
    const encodedTitle = encodeURIComponent(title);
    return `https://placehold.co/400x600/F3EBDD/392D24?text=${encodedTitle}`;
}

async function seed(): Promise<void> {
    if (BOOKS.length !== 60) {
        throw new Error(`Se esperaban 60 libros y hay ${BOOKS.length}.`);
    }

    const batch = db.batch();

    for (const book of BOOKS) {
        const productRef = db.collection("products").doc(book.id);

        batch.set(productRef, {
            ...book,
            imageUrl: createCoverUrl(book.title),
            createdAt: FieldValue.serverTimestamp(),
        });
    }

    await batch.commit();

    console.log(`Carga finalizada: ${BOOKS.length} productos procesados.`);
}

seed().catch((error: unknown) => {
    console.error("Error al cargar los productos:", error);
    process.exitCode = 1;
});

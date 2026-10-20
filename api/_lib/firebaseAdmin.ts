import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function readEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Falta la variable de entorno ${name}`);
    }

    return value;
}

// Si la función se reutiliza entre invocaciones, no se inicializa dos veces.
function getAdminApp() {
    const existing = getApps()[0];

    if (existing) {
        return existing;
    }

    return initializeApp({
        credential: cert({
            projectId: readEnv("FIREBASE_PROJECT_ID"),
            clientEmail: readEnv("FIREBASE_CLIENT_EMAIL"),
            // En las variables de entorno los saltos de línea llegan como
            // el texto "\n"; hay que convertirlos en saltos reales.
            privateKey: readEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
        }),
    });
}

const app = getAdminApp();

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
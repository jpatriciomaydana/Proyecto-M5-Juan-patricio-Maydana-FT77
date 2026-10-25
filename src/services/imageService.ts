import { auth } from "./firebase";

interface UploadUrlResponse {
    uploadUrl: string;
    publicUrl: string;
}

const GENERIC_ERROR = "No pudimos subir la imagen. Intentá de nuevo.";

function isUploadUrlResponse(data: unknown): data is UploadUrlResponse {
    return (
        typeof data === "object" &&
        data !== null &&
        "uploadUrl" in data &&
        typeof data.uploadUrl === "string" &&
        "publicUrl" in data &&
        typeof data.publicUrl === "string"
    );
}

function getUploadUrlErrorMessage(status: number): string {
    if (status === 401) {
        return "Tu sesión venció. Volvé a iniciar sesión.";
    }

    if (status === 403) {
        return "Solo los administradores pueden subir imágenes.";
    }

    if (status === 400) {
        return "Tipo de archivo no permitido. Usá JPG, PNG o WebP.";
    }

    return GENERIC_ERROR;
}

// Paso 1: pide al servidor una URL prefirmada. Paso 2: sube el archivo
// directo a S3 con esa URL. Devuelve la URL pública de la imagen.
export async function uploadProductImage(file: File): Promise<string> {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("Tenés que iniciar sesión para subir imágenes.");
    }

    const token = await user.getIdToken();

    let urlResponse: Response;

    try {
        urlResponse = await fetch("/api/upload-url", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ contentType: file.type }),
        });
    } catch {
        throw new Error(GENERIC_ERROR);
    }

    if (!urlResponse.ok) {
        throw new Error(getUploadUrlErrorMessage(urlResponse.status));
    }

    let data: unknown;

    try {
        data = await urlResponse.json();
    } catch {
        throw new Error(GENERIC_ERROR);
    }

    if (!isUploadUrlResponse(data)) {
        throw new Error(GENERIC_ERROR);
    }

    let uploadResponse: Response;

    try {
        // El Content-Type tiene que ser el mismo que firmó el servidor.
        uploadResponse = await fetch(data.uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
        });
    } catch {
        throw new Error(GENERIC_ERROR);
    }

    if (!uploadResponse.ok) {
        throw new Error(GENERIC_ERROR);
    }

    return data.publicUrl;
}
import { randomUUID } from "node:crypto";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { VercelRequest, VercelResponse } from "@vercel/node";

import { adminAuth, adminDb } from "./_lib/firebaseAdmin.js";
import { AWS_REGION, S3_BUCKET, s3Client } from "./_lib/s3.js";

// Solo estos tipos; no se acepta svg (puede contener código) ni gif.
const EXTENSIONS: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
};

const URL_LIFETIME_SECONDS = 300;

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

export default async function handler(
    req: VercelRequest,
    res: VercelResponse,
): Promise<void> {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        res.status(405).json({ error: "Método no permitido" });
        return;
    }

    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        res.status(401).json({ error: "Falta el token de sesión" });
        return;
    }

    let uid: string;

    try {
        const decoded = await adminAuth.verifyIdToken(header.slice(7));
        uid = decoded.uid;
    } catch {
        res.status(401).json({ error: "Sesión inválida o vencida" });
        return;
    }

    try {
        // El rol se lee de Firestore desde el servidor: no se confía en nada
        // que mande el navegador.
        const userSnap = await adminDb.collection("users").doc(uid).get();

        if (userSnap.data()?.role !== "admin") {
            res.status(403).json({ error: "Solo un administrador puede subir imágenes" });
            return;
        }

        const contentType: unknown = isRecord(req.body)
            ? req.body.contentType
            : undefined;

        if (typeof contentType !== "string" || !(contentType in EXTENSIONS)) {
            res.status(400).json({
                error: "Tipo de archivo no permitido. Usá JPG, PNG o WEBP.",
            });
            return;
        }

        // El nombre lo genera el servidor: el navegador no puede elegir la
        // ruta ni pisar un archivo existente.
        const key = `products/${randomUUID()}.${EXTENSIONS[contentType]}`;

        const command = new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: key,
            ContentType: contentType,
        });

        const uploadUrl = await getSignedUrl(s3Client, command, {
            expiresIn: URL_LIFETIME_SECONDS,
        });

        const publicUrl = `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;

        res.status(200).json({ uploadUrl, publicUrl });
    } catch (error) {
        console.error("upload-url falló:", error);
        res.status(500).json({ error: "No se pudo preparar la subida" });
    }
}
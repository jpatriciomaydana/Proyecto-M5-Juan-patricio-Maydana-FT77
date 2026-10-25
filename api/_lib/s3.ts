import { S3Client } from "@aws-sdk/client-s3";

function readEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Falta la variable de entorno ${name}`);
    }

    return value;
}

export const S3_BUCKET = readEnv("S3_BUCKET");
export const AWS_REGION = readEnv("AWS_REGION");

// Las claves (AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY) las lee el SDK
// directamente de las variables de entorno; no se pasan en el código.
//
// requestChecksumCalculation: las versiones nuevas del SDK agregan por
// defecto un checksum a la URL prefirmada, y el navegador no lo manda, lo que
// puede hacer fallar la subida. Con "WHEN_REQUIRED" no se agrega.
export const s3Client = new S3Client({
    region: AWS_REGION,
    requestChecksumCalculation: "WHEN_REQUIRED",
});
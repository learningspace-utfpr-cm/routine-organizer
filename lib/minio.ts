import { Client } from "minio";

type MinioConfig = {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  bucket: string;
  region?: string;
};

const globalForMinio = globalThis as unknown as {
  minioClient?: Client;
  minioConfig?: MinioConfig;
};

function resolveConfig(): MinioConfig {
  if (globalForMinio.minioConfig) {
    return globalForMinio.minioConfig;
  }

  const endPoint = process.env.MINIO_ENDPOINT;
  const accessKey = process.env.MINIO_ACCESS_KEY;
  const secretKey = process.env.MINIO_SECRET_KEY;
  const bucket = process.env.MINIO_BUCKET;

  if (!endPoint || !accessKey || !secretKey || !bucket) {
    throw new Error(
      "Configuração do MinIO incompleta. Verifique os envs MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY e MINIO_BUCKET."
    );
  }

  const config: MinioConfig = {
    endPoint,
    port: process.env.MINIO_PORT
      ? Number(process.env.MINIO_PORT)
      : 9000,
    useSSL: process.env.MINIO_USE_SSL === "true",
    accessKey,
    secretKey,
    bucket,
    region: process.env.MINIO_REGION,
  };

  globalForMinio.minioConfig = config;
  return config;
}

export function getMinioClient() {
  if (!globalForMinio.minioClient) {
    const config = resolveConfig();
    globalForMinio.minioClient = new Client({
      endPoint: config.endPoint,
      port: config.port,
      useSSL: config.useSSL,
      accessKey: config.accessKey,
      secretKey: config.secretKey,
    });
  }

  return globalForMinio.minioClient;
}

export async function ensureBucketExists(bucketName?: string) {
  const { bucket, region } = resolveConfig();
  const finalBucket = bucketName ?? bucket;
  const client = getMinioClient();

  const exists = await client.bucketExists(finalBucket).catch(() => false);
  if (!exists) {
    await client.makeBucket(finalBucket, region || "us-east-1");
  }
}

export function getBucketName() {
  const { bucket } = resolveConfig();
  return bucket;
}

export function buildObjectUrl(objectKey: string) {
  const config = resolveConfig();
  const baseUrl =
    process.env.MINIO_PUBLIC_URL ||
    `${config.useSSL ? "https" : "http"}://${config.endPoint}${
      config.port ? `:${config.port}` : ""
    }`;

  return `${baseUrl}/${config.bucket}/${objectKey}`;
}

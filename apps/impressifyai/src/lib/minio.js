import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT,
  region: process.env.MINIO_REGION,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
});

const contentTypeToExtension = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/bmp': 'bmp',
};

/**
 * Deletes a file from the S3/MinIO bucket.
 * @param {string} s3Key - The key (path) of the file to delete.
 * @returns {Promise<void>}
 */
export async function deleteFile(s3Key) {
  try {
    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: process.env.MINIO_BUCKET_NAME,
      Key: s3Key,
    });

    await s3Client.send(deleteObjectCommand);
    console.log(`Successfully deleted ${s3Key} from S3.`);

  } catch (error) {
    // Log the error but don't throw it to prevent the entire operation from failing
    // if only the S3 deletion part has an issue (e.g., file already deleted).
    console.error('S3 Delete Error:', error);
  }
}

/**
 * Uploads a buffer to S3 MinIO.
 * @param {Buffer} buffer - The file content as a buffer.
 * @param {string} contentType - The MIME type of the file (e.g., 'image/jpeg').
 * @param {string | null} originalName - The original name of the file, used to get the extension.
 * @returns {Promise<string>} The unique key (path) of the uploaded file in the bucket.
 */
export async function uploadBuffer(buffer, contentType, originalName = null) {
  try {
    let extension;
    // Prefer extension from the original file name if available.
    if (originalName && originalName.includes('.')) {
      extension = originalName.split('.').pop();
    } else {
      // Otherwise, try to guess from the content type.
      extension = contentTypeToExtension[contentType];
    }

    if (!extension) {
      // As a last resort for unknown image types, derive from subtype.
      if (contentType.startsWith('image/')) {
        extension = contentType.substring(6);
      } else {
        throw new Error(`Could not determine file extension for content type: ${contentType}`);
      }
    }

    const uniqueFileName = `${crypto.randomBytes(32).toString("hex")}.${extension}`;
    const now = new Date();
    const s3Key = `media/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${uniqueFileName}`;

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.MINIO_BUCKET_NAME,
      Key: s3Key,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(putObjectCommand);
    return s3Key;
  } catch (error) {
    console.error('S3 Upload Buffer Error:', error);
    throw new Error('Failed to upload buffer to S3.');
  }
}

/**
 * Uploads a File object (from FormData) to the S3/MinIO bucket.
 * @param {File} file - The file object to upload.
 * @returns {Promise<string>} The unique key (path) of the uploaded file in the bucket.
 */
export async function uploadFile(file) {
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  return uploadBuffer(fileBuffer, file.type, file.name);
}

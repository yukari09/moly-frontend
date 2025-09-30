import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { buildImagorUrl } from '@/lib/imagor';

const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT,
  region: process.env.MINIO_REGION,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
  forcePathStyle: true, // Required for MinIO
});

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { contentType } = await request.json();

    if (!contentType || !contentType.startsWith("image/")) {
        return NextResponse.json({ error: 'Invalid content type. Only images are allowed.' }, { status: 400 });
    }

    const fileExtension = contentType.split("/")[1];
    const userId = session.user.id;
    const fileName = generateFileName();
    const originalImagePath = `avatars/${userId}/${fileName}.${fileExtension}`;

    // Generate the pre-signed URL for uploading the original image to MinIO
    const command = new PutObjectCommand({
      Bucket: process.env.MINIO_BUCKET_NAME,
      Key: originalImagePath,
      ContentType: contentType,
    });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    // Pre-calculate the final, processed Imagor URL that we will save to the database
    const finalAvatarUrl = buildImagorUrl(originalImagePath, {
      width: 128, // Standard avatar size
      height: 128,
      smart: true,
      filters: ['quality(85)', 'format(webp)']
    });

    return NextResponse.json({ 
        signedUrl: signedUrl,
        finalAvatarUrl: finalAvatarUrl // This is the full URL to be saved
    });

  } catch (error) {
    console.error("Error creating signed URL:", error);
    return NextResponse.json({ error: 'Failed to create signed URL.' }, { status: 500 });
  }
}
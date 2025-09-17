import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import logger from '@/lib/logger';
import * as gql from '@/lib/graphql';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { buildImagorUrl } from '@/lib/imagor';
import crypto from "crypto";

// --- Start of S3/MinIO Configuration ---
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

const allowedImageTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const MAX_AVATAR_SIZE_MB = 2;
const MAX_AVATAR_SIZE_BYTES = MAX_AVATAR_SIZE_MB * 1024 * 1024;
// --- End of S3/MinIO Configuration ---


export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const userMeta = [];
    
    // 1. Handle avatar upload if present
    const avatarFile = formData.get('avatar');
    if (avatarFile && typeof avatarFile.size !== 'undefined' && avatarFile.size > 0) {
      // Validate file type
      if (!allowedImageTypes[avatarFile.type]) {
        return NextResponse.json({ error: `Invalid content type. Only ${Object.keys(allowedImageTypes).join(', ')} are allowed.` }, { status: 400 });
      }

      // Validate file size
      if (avatarFile.size > MAX_AVATAR_SIZE_BYTES) {
        return NextResponse.json({ error: `File size cannot exceed ${MAX_AVATAR_SIZE_MB}MB.` }, { status: 400 });
      }

      const fileExtension = allowedImageTypes[avatarFile.type];
      const userId = session.user.id;
      const fileName = generateFileName();
      const originalImagePath = `avatars/${userId}/${fileName}.${fileExtension}`;
      
      // Upload to S3/MinIO
      const fileBuffer = Buffer.from(await avatarFile.arrayBuffer());
      const command = new PutObjectCommand({
        Bucket: process.env.MINIO_BUCKET_NAME,
        Key: originalImagePath,
        ContentType: avatarFile.type,
        Body: fileBuffer,
      });
      await s3Client.send(command);

      // Pre-calculate the final, processed Imagor URL
      const finalAvatarUrl = buildImagorUrl(originalImagePath, {
        width: 128,
        height: 128,
        smart: true,
        filters: ['quality(85)', 'format(webp)']
      });

      userMeta.push({ metaKey: "avatar", metaValue: finalAvatarUrl });
    }

    // 2. Process other form fields
    const formValues = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'avatar') {
        userMeta.push({ metaKey: key, metaValue: value });
        formValues[key] = value;
      }
    }
    
    // 3. Handle username change tracking
    const originalUsername = session.user.userMeta.find(m => m.metaKey === 'username')?.metaValue;
    const hasChangedUsername = session.user.userMeta.find(m => m.metaKey === 'has_been_changed_username')?.metaValue === 'true';
    if (!hasChangedUsername && formValues.username && formValues.username !== originalUsername) {
        userMeta.push({ metaKey: "has_been_changed_username", metaValue: "true" });
    }

    logger.info("Updating user profile with metadata:", userMeta);

    if (userMeta.length === 0) {
        // This case should ideally not be hit if form is submitted, but as a safeguard:
        return NextResponse.json({ message: 'No update data provided.' }, { status: 200 });
    }

    // 4. Call GraphQL mutation
    const updatedUser = await gql.updateUserMeta(userMeta, session);

    return NextResponse.json({ user: updatedUser });

  } catch (error) {
    logger.error("Error in /api/user/update:", error);
    if (error.message.includes('Unsupported content-type')) {
        return NextResponse.json({ error: 'Invalid request format. Expected multipart/form-data.' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
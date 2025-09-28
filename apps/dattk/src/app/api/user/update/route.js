import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import logger from '@/lib/logger';
import * as gql from '@/lib/graphql';
import { uploadFile } from '@/lib/minio';
import { buildImagorUrl } from '@/lib/imagor';

// Define validation constants
const allowedImageTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];
const MAX_AVATAR_SIZE_MB = 2;
const MAX_AVATAR_SIZE_BYTES = MAX_AVATAR_SIZE_MB * 1024 * 1024;

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
      if (!allowedImageTypes.includes(avatarFile.type)) {
        return NextResponse.json({ error: `Invalid content type. Only ${allowedImageTypes.join(', ')} are allowed.` }, { status: 400 });
      }

      // Validate file size
      if (avatarFile.size > MAX_AVATAR_SIZE_BYTES) {
        return NextResponse.json({ error: `File size cannot exceed ${MAX_AVATAR_SIZE_MB}MB.` }, { status: 400 });
      }

      // Upload using the library function
      const s3Key = await uploadFile(avatarFile);

      // Build the final URL
      const finalAvatarUrl = buildImagorUrl(s3Key, {
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
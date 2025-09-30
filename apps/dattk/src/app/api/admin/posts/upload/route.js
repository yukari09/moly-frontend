
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { imageSize } from 'image-size';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createPost } from '@/lib/graphql';
import { buildImagorUrl } from '@/lib/imagor';
import { uploadFile } from '@/lib/minio';
import logger from '@/lib/logger';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: 0, message: 'Authentication required' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json({ success: 0, message: 'No file provided' }, { status: 400 });
    }

    // Get image dimensions from buffer before upload
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const dimensions = imageSize(fileBuffer);

    // 1. Upload file using the centralized module
    // Note: We pass the original 'file' object to uploadFile.
    // Reading the buffer beforehand for dimensions is acceptable.
    const s3Key = await uploadFile(file);
    logger.info('File uploaded to S3', { s3Key });

    // 2. Create a corresponding post in the GraphQL backend
    const attachmentInput = {
      postTitle: file.name,
      postStatus: 'inherit',
      postType: 'attachment',
      postMimeType: file.type,
            postMeta: [
        { metaKey: '_attached_file', metaValue: s3Key },
        { metaKey: '_width', metaValue: dimensions.width },
        { metaKey: '_height', metaValue: dimensions.height },
        { metaKey: '_file_size', metaValue: fileBuffer.length }
      ],
      postDate: new Date().toISOString(),
    };

    const newPost = await createPost(attachmentInput, session);
    logger.info('Created attachment post', { postId: newPost.id, s3Key });

    // 3. Return the successful response with dimensions
    return NextResponse.json({
      success: 1,
      file: {
        url: buildImagorUrl(s3Key), // Use original for editor to get dimensions
        id: newPost.id,
        s3Key: s3Key,
        width: dimensions.width,
        height: dimensions.height,
      },
    });

  } catch (error) {
    logger.error('File upload process failed', { error: error.message });
    return NextResponse.json({ success: 0, message: error.message || 'Error uploading file' }, { status: 500 });
  }
}

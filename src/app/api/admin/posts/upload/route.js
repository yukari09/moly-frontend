
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
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

    // 1. Upload file using the centralized module
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
      ],
      postDate: new Date().toISOString(),
    };

    const newPost = await createPost(attachmentInput, session);
    logger.info('Created attachment post', { postId: newPost.id, s3Key });

    // 3. Build multiple URLs using Imagor for responsive images
    const urls = {
        thumbnail: buildImagorUrl(s3Key, { width: 150, height: 150, fitIn: 'fit-in' }),
        medium: buildImagorUrl(s3Key, { width: 768 }),
        large: buildImagorUrl(s3Key, { width: 1920 }),
        original: buildImagorUrl(s3Key) // Unprocessed
    };

    // 4. Return the successful response
    return NextResponse.json({
      success: 1,
      file: {
        url: urls.original, // Use medium size for editor preview
        urls: urls,       // Provide all sizes for the frontend to use later
        id: newPost.id,
        s3Key: s3Key,
      },
    });

  } catch (error) {
    logger.error('File upload process failed', { error: error.message });
    return NextResponse.json({ success: 0, message: error.message || 'Error uploading file' }, { status: 500 });
  }
}

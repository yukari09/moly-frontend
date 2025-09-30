import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createPost } from '@/lib/graphql';
import { imageSize } from 'image-size';
import { buildImagorUrl } from '@/lib/imagor';
import { uploadBuffer } from '@/lib/minio';
import logger from '@/lib/logger';
import path from 'path';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: 0, message: 'Authentication required' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const imageUrl = body.url;

    if (!imageUrl) {
      return NextResponse.json({ success: 0, message: 'No URL provided' }, { status: 400 });
    }

    // 1. Fetch the image from the external URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
    }
    const contentType = response.headers.get('content-type');
    const buffer = Buffer.from(await response.arrayBuffer());
    const dimensions = imageSize(buffer);
    
    // Extract a file name from the URL path for better naming
    const originalName = path.basename(new URL(imageUrl).pathname);

    // 2. Upload file using the centralized buffer function
    const s3Key = await uploadBuffer(buffer, contentType, originalName);
    logger.info('File fetched from URL and uploaded to S3', { s3Key, originalUrl: imageUrl });

    // 3. Create a corresponding post in the GraphQL backend
    const attachmentInput = {
      postTitle: originalName || 'Image from URL',
      postStatus: 'inherit',
      postType: 'attachment',
      postMimeType: contentType,
      postMeta: [
        { metaKey: '_attached_file', metaValue: s3Key },
        { metaKey: '_width', metaValue: dimensions.width },
        { metaKey: '_height', metaValue: dimensions.height },
        { metaKey: '_file_size', metaValue: buffer.length }
      ],
      postDate: new Date().toISOString(),
    };

    const newPost = await createPost(attachmentInput, session);
    logger.info('Created attachment post for fetched image', { postId: newPost.id, s3Key });

    // 4. Build Imagor URLs
    const urls = {
        thumbnail: buildImagorUrl(s3Key, { width: 150, height: 150, fitIn: 'fit-in' }),
        medium: buildImagorUrl(s3Key, { width: 768 }),
        large: buildImagorUrl(s3Key, { width: 1920 }),
        original: buildImagorUrl(s3Key)
    };

    // 5. Return the successful response, consistent with the byFile endpoint
    return NextResponse.json({
      success: 1,
      file: {
        url: urls.medium,
        urls: urls,
        id: newPost.id,
        s3Key: s3Key,
      },
    });

  } catch (error) {
    logger.error('Fetch by URL process failed', { error: error.message });
    return NextResponse.json({ success: 0, message: error.message || 'Error fetching by URL' }, { status: 500 });
  }
}

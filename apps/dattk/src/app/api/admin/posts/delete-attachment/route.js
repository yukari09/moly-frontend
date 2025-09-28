import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { destroyPost } from '@/lib/graphql';
import { deleteFile } from '@/lib/minio';
import logger from '@/lib/logger';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: 0, message: 'Authentication required' }, { status: 401 });
  }

  try {
    const { id, s3Key } = await req.json();

    if (!id || !s3Key) {
      return NextResponse.json({ success: 0, message: 'Attachment ID and S3 Key are required.' }, { status: 400 });
    }

    // We can run these in parallel as they don't depend on each other.
    await Promise.all([
      deleteFile(s3Key),          // Delete the file from MinIO
      destroyPost(id, session)    // Delete the attachment post from the database
    ]);

    logger.info('Successfully deleted attachment', { postId: id, s3Key });

    return NextResponse.json({ success: 1 });

  } catch (error) {
    logger.error('Delete attachment process failed', { error: error.message });
    return NextResponse.json({ success: 0, message: error.message || 'Error deleting attachment' }, { status: 500 });
  }
}

'use server';

import { createPost } from "@/lib/graphql";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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

// Helper function to upload image from server to MinIO and create media post
async function uploadImageAndCreateMediaPost(file, meta) {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split('.').pop();
    const newFileName = generateFileName();
    const originalImagePath = `media/contributions/${newFileName}.${fileExtension}`;

    // 1. Upload to MinIO from server
    const command = new PutObjectCommand({
      Bucket: process.env.MINIO_BUCKET_NAME,
      Key: originalImagePath,
      Body: buffer,
      ContentType: file.type,
    });
    await s3Client.send(command);

    // 2. Create media type post in GraphQL
    const finalImageUrl = buildImagorUrl(originalImagePath);
    const mediaPostInput = {
      postTitle: file.name,
      postType: "media",
      postDate: new Date().toISOString(),
      postMimeType: file.type,
      postMeta: [
        { metaKey: "media_type", metaValue: file.type.startsWith('image') ? 'image' : 'file' },
        { metaKey: "source_url", metaValue: finalImageUrl },
        { metaKey: "original_minio_path", metaValue: originalImagePath },
        { metaKey: "width", metaValue: meta.width.toString() },
        { metaKey: "height", metaValue: meta.height.toString() },
        { metaKey: "size", metaValue: file.size.toString() },
        { metaKey: "description", metaValue: meta.description || "" },
      ],
    };

    const mediaPostResult = await createPost(mediaPostInput);
    if (!mediaPostResult || !mediaPostResult.data || !mediaPostResult.data.createPost || !mediaPostResult.data.createPost.id) {
      throw new Error('Failed to create media post in GraphQL.');
    }

    return mediaPostResult.data.createPost.id;
  } catch (error) {
    console.error("Error in uploadImageAndCreateMediaPost:", error);
    throw error;
  }
}

export async function submitContribution(formData) {
  try {
    let thumbnailId = null;
    const galleryMediaIds = [];

    // 1. Handle Hero Image Upload
    const heroImageFile = formData.get('heroImage');
    if (heroImageFile) {
      const meta = JSON.parse(formData.get('heroImageMeta'));
      thumbnailId = await uploadImageAndCreateMediaPost(heroImageFile, meta);
    }

    // 2. Handle Gallery Images Upload
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('gallery_')) {
        const index = key.split('_')[1];
        const meta = JSON.parse(formData.get(`galleryMeta_${index}`));
        const mediaId = await uploadImageAndCreateMediaPost(value, meta);
        galleryMediaIds.push(mediaId);
      }
    }

    // 3. Construct the postMeta array from form values
    const values = Object.fromEntries(formData.entries());
    const date = JSON.parse(values.date);
    const type = JSON.parse(values.type);

    const postMeta = [
      { metaKey: "country", metaValue: values.country },
      { metaKey: "city", metaValue: values.city || '' },
      { metaKey: "date_start", metaValue: date.from ? new Date(date.from).getTime().toString() : '' },
      { metaKey: "date_end", metaValue: date.to ? new Date(date.to).getTime().toString() : (date.from ? new Date(date.from).getTime().toString() : '') },
      { metaKey: "festival_type", metaValue: type.join(',') },
      { metaKey: "official_link", metaValue: values.officialWebsite || '' },
      { metaKey: "ticket_info", metaValue: values.ticketInfo || '' },
      { metaKey: "venue_details", metaValue: values.venueDetails || '' },
      { metaKey: "schedule_highlights", metaValue: values.scheduleHighlights || '' },
      { metaKey: "unique_aspects", metaValue: values.uniqueAspects || '' },
    ];

    if (values.email) {
      postMeta.push({ metaKey: "contributor_email", metaValue: values.email });
    }

    if (thumbnailId) {
      postMeta.push({ metaKey: "thumbnail_id", metaValue: thumbnailId });
    }

    galleryMediaIds.forEach((id, index) => {
      postMeta.push({ metaKey: `media_${index + 1}`, metaValue: id });
    });

    // 4. Construct the main input object for the mutation
    const postContent = `<!-- STORY -->\n${values.storyContent || ''}\n<!-- TRADITIONS -->\n${values.traditionsContent || ''}\n<!-- TRAVELER_GUIDE -->\n${values.travelerGuideContent || ''}`;

    const tagsArray = values.tags ? values.tags.split(',').map(tag => {
      const tagName = tag.trim();
      return JSON.stringify({
        name: tagName,
        term_taxonomy: [{ taxonomy: "post_tag" }],
        slug: tagName.toLowerCase().replace(/\s/g, '-')
      });
    }) : [];

    const input = {
      postTitle: values.title,
      postContent: postContent,
      postExcerpt: values.overview || '',
      postDate: new Date().toISOString(),
      postStatus: "pending",
      postType: "festival",
      tags: tagsArray,
      postMeta: postMeta,
    };

    // 5. Call the GraphQL mutation
    const result = await createPost(input);

    if (result && result.data && result.data.createPost && result.data.createPost.id) {
      return { success: true, message: "Contribution received!" };
    } else {
      const errorMessage = result?.errors?.[0]?.message || "Unknown GraphQL error.";
      return { success: false, message: `Submission failed: ${errorMessage}` };
    }
  } catch (error) {
    console.error("Server Action failed:", error);
    return { success: false, message: error.message || "An unexpected error occurred." };
  }
}
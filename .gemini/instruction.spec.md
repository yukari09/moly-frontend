# Project Tech Stack

This document outlines the main technologies, libraries, and frameworks used in this project.

## Core Framework

- **Framework**: [Next.js](https://nextjs.org/) (v15)
- **UI**: [React](https://react.dev/) (v19)
- **Language**: JavaScript

## API & Data Layer

- **GraphQL API**: Custom GraphQL client with WordPress-compatible schema
  - Centralized request handling with authentication
  - WordPress-style data structures (posts, categories, tags, user meta)
  - Environment-based configuration (GRAPHQL_API_URL, GRAPHQL_SECRET_KEY, GRAPHQL_TENANT)
- **Search**: [Elasticsearch](https://www.elastic.co/elasticsearch/) - Used for search functionality
  - Configured with authentication (ELASTICSEARCH_NODE, ELASTICSEARCH_USERNAME, ELASTICSEARCH_PASSWORD)
  - Singleton client pattern for connection management
- **Caching/Rate Limiting**: [Redis](https://redis.io/) (via `ioredis`)
  - Custom rate limiting implementation
  - Email rate limiting and general purpose caching
  - Graceful connection handling with fallbacks

## WordPress-Compatible Structure

The project uses a WordPress-inspired data model:

- **Posts**: `postTitle`, `postContent`, `postStatus`, `postTags`
- **Taxonomies**: `categories` and `tags` with term relationships
- **User Meta**: Flexible user metadata system
- **GraphQL Schema**: WordPress-style mutations and queries
  - `listPostsOffset`, `listTermsOffset` for pagination
  - `createPost`, `updatePost`, `destroyPost` for content management
  - `createTerm`, `updateTerm`, `destroyTerm` for taxonomy management

## UI & Styling

- **Component Library**: [shadcn/ui](https://ui.shadcn.com/) - A collection of re-usable components built on Radix UI and Tailwind CSS.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4) - A utility-first CSS framework.
- **Icons**: [Lucide React](https://lucide.dev/) - A fork of Feather Icons.

## Forms & Validation

- **Form Management**: [React Hook Form](https://react-hook-form.com/) - For building performant and flexible forms.
- **Schema Validation**: [Zod](https://zod.dev/) - Used with React Hook Form for type-safe schema validation.

## Rich Text Editing

- **Editor Framework**: [Plate.js](https://platejs.org/) - A rich-text editor framework for React, built on top of Slate.

## Authentication

- **Framework**: [NextAuth.js](https://next-auth.js.org/) - Provides authentication for Next.js applications.
- **Integration**: Works with GraphQL backend for user management

## Internationalization

- **Library**: [next-intl](https://next-intl-docs.vercel.app/) - A library for internationalization (i18n) in Next.js.

## Backend Services & Data

- **File Storage**: [AWS S3](https://aws.amazon.com/s3/) - Used for object storage.

## Testing

- **Test Runner**: [Vitest](https://vitest.dev/) - A fast unit-test framework.
- **Testing Library**: [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - For testing React components.

## Key Dependencies

- **Tables**: `@tanstack/react-table`
- **Charts**: `recharts`
- **Notifications**: `sonner`
- **Email**: `nodemailer`

## File Upload Specification (S3/MinIO)

This section details the process for uploading files (e.g., images for blog posts) from the client to the backend.

### 1. API Endpoint

- **URL:** `/api/admin/posts/upload`
- **Method:** `POST`

### 2. Authentication

- The endpoint is protected and requires a valid `next-auth` session.
- The request must include the CSRF token provided by `next-auth`, sent in the `x-csrf-token` header.

### 3. Request Format

- The request body must be of type `multipart/form-data`.
- The file being uploaded must be in a field named `image`.

### 4. Storage Logic (MinIO)

- **SDK:** File handling is done using the `@aws-sdk/client-s3` library.
- **Client Configuration:** The S3 client is configured to connect to a MinIO instance by using the `endpoint` and `forcePathStyle: true` parameters, which are read from environment variables (`S3_ENDPOINT`, etc.).
- **File Naming & Path:**
    - A unique path is generated for each uploaded file to prevent collisions.
    - **Format:** `media/YYYY/MM/{uuid}.{extension}`
    - `YYYY`: 4-digit year (e.g., 2025)
    - `MM`: 2-digit month (e.g., 09)
    - `{uuid}`: A cryptographically random UUID.
    - `{extension}`: The original file extension.
- **Object Metadata:**
    - `ContentType`: The original MIME type of the file is preserved.
    - `ACL`: Set to `public-read` to allow services like Imagor to access the file.

### 5. Post-Processing (GraphQL)

- After a successful upload to MinIO, a corresponding record is created in the GraphQL backend.
- A `createPost` mutation is called with the following input:
    - `postType`: `'attachment'`
    - `postTitle`: The original filename.
    - `postStatus`: `'inherit'`
    - `postMimeType`: The file's MIME type.
    - `postMeta`: An array containing an object to link the file. The structure is `{ metaKey: '_wp_attached_file', metaValue: '{s3Key}' }`, where `{s3Key}` is the full path generated in the previous step.

### 6. Response Format

#### Success

- **Status Code:** `200 OK`
- **Body:** A JSON object confirming the upload and providing URLs for consumption.

```json
{
  "success": 1,
  "file": {
    "url": "https://.../medium_size.jpg",
    "urls": {
      "thumbnail": "https://.../thumbnail_size.jpg",
      "medium": "https://.../medium_size.jpg",
      "large": "https://.../large_size.jpg",
      "original": "https://.../original.jpg"
    },
    "id": "POST_ID_FROM_GRAPHQL",
    "s3Key": "PATH_IN_S3"
  }
}
```
- `file.url`: The default URL for editor preview (medium size).
- `file.urls`: An object containing multiple sizes for responsive rendering on the frontend.

#### Failure

- **Status Code:** `400`, `401`, `500`, etc.
- **Body:**
```json
{
  "success": 0,
  "message": "Error description"
}
```

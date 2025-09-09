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

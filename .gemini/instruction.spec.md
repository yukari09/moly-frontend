# Project Tech Stack

This document outlines the main technologies, libraries, and frameworks used in this project.

## Core Framework

- **Framework**: [Next.js](https://nextjs.org/) (v15)
- **UI**: [React](https://react.dev/) (v19)
- **Language**: JavaScript

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

## Internationalization

- **Library**: [next-intl](https://next-intl-docs.vercel.app/) - A library for internationalization (i18n) in Next.js.

## Backend Services & Data

- **Search**: [Elasticsearch](https://www.elastic.co/elasticsearch/) - Used for search functionality.
- **Caching/In-Memory Store**: [Redis](https://redis.io/) (via `ioredis`) - Used for caching and other tasks like rate limiting.
- **File Storage**: [AWS S3](https://aws.amazon.com/s3/) - Used for object storage.

## Testing

- **Test Runner**: [Vitest](https://vitest.dev/) - A fast unit-test framework.
- **Testing Library**: [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - For testing React components.

## Key Dependencies

- **Tables**: `@tanstack/react-table`
- **Charts**: `recharts`
- **Notifications**: `sonner`
- **Email**: `nodemailer`

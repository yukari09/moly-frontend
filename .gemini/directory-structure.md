# Moly-Frontend Directory Structure Plan

This document outlines the planned directory structure based on the `design-blueprint.md` to ensure a scalable and organized codebase.

---

### 1. App Router Structure (`src/app/[locale]/`)

This structure defines the primary routes of the application, directly corresponding to the key pages in the design blueprint.

```
src/app/[locale]/
├── page.jsx             # Home Page
├── about/
│   └── page.jsx         # About Us Page
├── contribute/
│   └── page.jsx         # Contribute Page
├── explore/
│   └── page.jsx         # Explore Festivals Page
├── festival/
│   └── [slug]/
│       └── page.jsx     # Festival Detail Page (Dynamic)
└── stories/
    └── page.jsx         # Stories/Blog Page
```

---

### 2. Component Structure (`src/components/`)

This structure organizes React components based on their scope and reusability.

```
src/components/
├── layout/              # Global layout components
│   ├── AppHeader.jsx
│   ├── AppFooter.jsx
│   └── MainNav.jsx
│
├── home/                # Components specific to the Home page
│   ├── HomeHeroSection.jsx
│   └── FeaturedFestivals.jsx
│
├── explore/             # Components specific to the Explore page
│   ├── FestivalCalendar.jsx
│   └── FilterControls.jsx
│
├── festival/            # Components for the Festival Detail page
│   ├── FestivalHero.jsx
│   ├── TravelerGuide.jsx
│   └── FestivalGallery.jsx
│
├── stories/             # Components for the Stories/Blog section
│   ├── ArticleGrid.jsx
│   └── FeaturedArticle.jsx
│
└── shared/              # Common components reusable across the app
    ├── Card.jsx
    ├── InteractiveMap.jsx
    ├── Button.jsx
    └── Spinner.jsx
```

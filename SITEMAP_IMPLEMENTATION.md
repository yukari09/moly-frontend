# Dynamic Sitemap Implementation

This document describes the implementation of the dynamic sitemap system for the multi-language AI prompt generator platform.

## Overview

The sitemap system has been implemented using `next-sitemap` with support for:
- Multiple languages (8 locales: en, zh, ja, ko, fr, es, pt, de)
- Dynamic content generation
- Search engine submission
- Proper lastmod and changefreq values
- Hierarchical sitemap structure

## Files Created/Modified

### Configuration Files
- `next-sitemap.config.js` - Main configuration for next-sitemap
- `package.json` - Added sitemap generation scripts

### API Routes
- `src/app/server-sitemap-index.xml/route.js` - Server-side sitemap index
- `src/app/sitemap-[locale].xml/route.js` - Locale-specific sitemaps
- `src/app/api/sitemap/submit/route.js` - Sitemap submission API

### Utility Functions
- `src/lib/sitemap.js` - Sitemap utilities and search engine submission

### Updated Files
- `src/app/sitemap.js` - Enhanced with proper priorities and frequencies
- `public/robots.txt` - Added sitemap references

### Tests
- `src/test/sitemap.test.js` - Comprehensive test suite

## Sitemap Structure

```
/sitemap.xml (main sitemap index)
├── /sitemap-0.xml (static routes)
├── /server-sitemap-index.xml (dynamic sitemap index)
├── /sitemap-en.xml (English pages)
├── /sitemap-zh.xml (Chinese pages)
├── /sitemap-ja.xml (Japanese pages)
├── /sitemap-ko.xml (Korean pages)
├── /sitemap-fr.xml (French pages)
├── /sitemap-es.xml (Spanish pages)
├── /sitemap-pt.xml (Portuguese pages)
└── /sitemap-de.xml (German pages)
```

## Page Priorities and Frequencies

| Page Type | Priority | Change Frequency | Description |
|-----------|----------|------------------|-------------|
| Home pages (`/{locale}`) | 1.0 | daily | Highest priority for main landing pages |
| Generator pages (`/{locale}/{generator}`) | 0.9 | weekly | High priority for main functionality |
| Root redirect (`/`) | 0.8 | daily | Important for SEO |
| Auth pages | 0.5 | monthly | Lower priority utility pages |
| Account pages | 0.5 | monthly | User-specific pages |

## Usage

### Automatic Generation
Sitemaps are automatically generated during the build process:

```bash
npm run build  # Automatically runs next-sitemap after build
```

### Manual Generation
Generate sitemaps manually:

```bash
npm run sitemap
```

### Search Engine Submission
Submit sitemaps to search engines via API:

```bash
# Check sitemap status
curl https://your-domain.com/api/sitemap/submit

# Submit sitemaps
curl -X POST https://your-domain.com/api/sitemap/submit
```

## Environment Variables

Set the following environment variable for production:

```env
SITE_URL=https://your-actual-domain.com
```

## Search Engine Integration

The system automatically submits sitemaps to:
- Google Search Console
- Bing Webmaster Tools

### Manual Submission URLs
- Google: `https://www.google.com/ping?sitemap=https://your-domain.com/sitemap.xml`
- Bing: `https://www.bing.com/ping?sitemap=https://your-domain.com/sitemap.xml`

## Robots.txt Integration

The `robots.txt` file has been updated to reference all sitemaps:

```
Sitemap: https://your-domain.com/sitemap.xml
Sitemap: https://your-domain.com/server-sitemap-index.xml
```

## Monitoring and Validation

### API Endpoints
- `GET /api/sitemap/submit` - Check sitemap accessibility
- `POST /api/sitemap/submit` - Submit sitemaps to search engines

### Validation Functions
```javascript
import { validateSitemap, getSitemapLastModified } from '@/lib/sitemap';

// Check if sitemap is accessible
const isValid = await validateSitemap('https://your-domain.com/sitemap.xml');

// Get last modified date
const lastMod = await getSitemapLastModified('https://your-domain.com/sitemap.xml');
```

## Locale-Specific Features

Each locale has its own sitemap with:
- Localized URLs
- Appropriate hreflang attributes
- Language-specific content priorities
- Regional search engine optimization

## Testing

Run the sitemap tests:

```bash
npm test -- src/test/sitemap.test.js --run
```

The test suite covers:
- URL generation
- Search engine submission
- Sitemap validation
- Error handling
- API functionality

## Production Deployment

1. Set the `SITE_URL` environment variable
2. Build the application: `npm run build`
3. Deploy the application
4. Submit sitemaps: `curl -X POST https://your-domain.com/api/sitemap/submit`
5. Verify in Google Search Console and Bing Webmaster Tools

## Troubleshooting

### Common Issues

1. **Sitemaps not generating**: Ensure `next-sitemap.config.js` is in the root directory
2. **Wrong URLs in sitemap**: Check `SITE_URL` environment variable
3. **Submission failures**: Verify sitemap accessibility and search engine API limits
4. **Missing pages**: Check route exclusions in `next-sitemap.config.js`

### Debug Commands

```bash
# Check sitemap accessibility
curl -I https://your-domain.com/sitemap.xml

# Validate XML format
curl https://your-domain.com/sitemap.xml | xmllint --format -

# Check robots.txt
curl https://your-domain.com/robots.txt
```

## Future Enhancements

- [ ] Add sitemap caching for better performance
- [ ] Implement sitemap compression (gzip)
- [ ] Add image and video sitemaps for rich content
- [ ] Integrate with Google Search Console API for automated monitoring
- [ ] Add sitemap analytics and reporting
- [ ] Implement incremental sitemap updates

## Requirements Fulfilled

✅ Install and configure next-sitemap
✅ Generate sitemaps for all languages and pages
✅ Add proper lastmod and changefreq values
✅ Submit sitemaps to search engines
✅ 多语言sitemap生成 (Multi-language sitemap generation)
import { submitSitemaps, validateSitemap, generateSitemapUrls } from '@/lib/sitemap';
import { getBaseUrl } from '@/lib/seo';

export async function POST(request) {
  try {
    const baseUrl = getBaseUrl();
    
    // Validate that sitemaps are accessible before submitting
    const sitemapUrls = generateSitemapUrls(baseUrl);
    const validationResults = await Promise.all(
      sitemapUrls.map(async (url) => ({
        url,
        valid: await validateSitemap(url)
      }))
    );

    const invalidSitemaps = validationResults.filter(result => !result.valid);
    
    if (invalidSitemaps.length > 0) {
      return Response.json({
        success: false,
        error: 'Some sitemaps are not accessible',
        invalidSitemaps: invalidSitemaps.map(s => s.url)
      }, { status: 400 });
    }

    // Submit sitemaps to search engines
    const submissionResults = await submitSitemaps(baseUrl);

    return Response.json({
      success: true,
      message: 'Sitemaps submitted successfully',
      results: submissionResults,
      sitemapsSubmitted: sitemapUrls
    });

  } catch (error) {
    console.error('Error in sitemap submission:', error);
    
    return Response.json({
      success: false,
      error: 'Failed to submit sitemaps',
      details: error.message
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const baseUrl = getBaseUrl();
    const sitemapUrls = generateSitemapUrls(baseUrl);
    
    // Check status of all sitemaps
    const statusResults = await Promise.all(
      sitemapUrls.map(async (url) => ({
        url,
        accessible: await validateSitemap(url)
      }))
    );

    return Response.json({
      success: true,
      baseUrl,
      sitemaps: statusResults
    });

  } catch (error) {
    console.error('Error checking sitemap status:', error);
    
    return Response.json({
      success: false,
      error: 'Failed to check sitemap status',
      details: error.message
    }, { status: 500 });
  }
}
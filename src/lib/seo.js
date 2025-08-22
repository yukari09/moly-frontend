// src/lib/seo.js

/**
 * Generates the root JSON-LD structured data for the entire site.
 * This includes Organization and WebSite schemas.
 * 
 * @returns {object} The JSON-LD object.
 */
export function generateRootStructuredData() {
  // IMPORTANT: Please replace these placeholder values with your actual data.
  const siteUrl = process.env.NEXTAUTH_URL || "https://www.moly.app"; // Your production domain
  const orgName = "Echo";
  const logoUrl = `${siteUrl}/logo.png`; // A full URL to your logo

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": orgName,
        "url": siteUrl,
        "logo": logoUrl,
        "sameAs": [
          // Add your social media profile URLs here
          // e.g., "https://twitter.com/YourProfile",
          // "https://www.linkedin.com/company/YourCompany"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": orgName,
        "description": "An AI-powered prompt generator to help you create effective and creative prompts for various AI models.",
        "publisher": {
          "@id": `${siteUrl}/#organization`
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${siteUrl}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };
}

/**
 * Generates JSON-LD structured data for the homepage.
 * @param {object} t - The translation object from next-intl.
 * @returns {object} The JSON-LD object for the homepage.
 */
export function generateHomepageStructuredData(t) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.moly.app";

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": siteUrl,
    "name": t('pageTitle'),
    "description": t('pageDescription'),
    "isPartOf": {
      "@id": `${siteUrl}/#website`
    }
  };
}
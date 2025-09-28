import React from 'react';

/**
 * A component to safely render JSON-LD structured data.
 * @param {{data: object}}
 */
export const StructuredData = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

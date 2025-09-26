import React, { useState, useEffect } from 'react';

/**
 * A component to safely render JSON-LD structured data.
 * @param {{data: object}}
 */
export const StructuredData = ({ data }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};
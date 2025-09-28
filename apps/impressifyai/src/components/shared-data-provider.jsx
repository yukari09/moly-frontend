'use client';

import React, { createContext, useContext } from 'react';

// 1. Create the context
const SharedDataContext = createContext(null);

/**
 * The Provider component that holds the shared data.
 * It receives data from a Server Component (like a Layout) and makes it available to all its children.
 * @param {{ categories: any[]; children: React.ReactNode }} props
 */
export const SharedDataProvider = ({ categories, children }) => {
  const value = {
    categories,
    // You can add more shared data here in the future
  };

  return (
    <SharedDataContext.Provider value={value}>
      {children}
    </SharedDataContext.Provider>
  );
};

/**
 * Custom hook to easily access the shared data in any Client Component.
 * @returns {{categories: any[]}}
 */
export const useSharedData = () => {
  const context = useContext(SharedDataContext);
  if (context === null) {
    throw new Error('useSharedData must be used within a SharedDataProvider');
  }
  return context;
};

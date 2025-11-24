'use client';

import React from 'react';

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                 bg-gray-900 text-white px-4 py-2 rounded-lg z-50 
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Skip to main content
    </a>
  );
}
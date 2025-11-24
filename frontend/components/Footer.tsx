'use client';

import React from 'react';

export function Footer() {
  return (
    <footer className="bg-amber-100 border-t border-amber-200 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-2">
        <p className="text-center text-amber-700 text-xs">
          © {new Date().getFullYear()} Blog Platform
        </p>
      </div>
    </footer>
  );
}



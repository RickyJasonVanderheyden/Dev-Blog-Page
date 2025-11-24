'use client';

import React from 'react';

export function Loader() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
    </div>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="card-base overflow-hidden animate-pulse h-full">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
}



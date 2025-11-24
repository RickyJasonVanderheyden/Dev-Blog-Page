'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { PostCard } from '@/components/PostCard';
import { ErrorBox } from '@/components/ErrorBox';
import { postsApi } from '@/lib/api';
import type { Post } from '@/lib/types';
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data: searchResults, isLoading, error, refetch } = useQuery<Post[]>({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query.trim()) return [];
      try {
        const response = await postsApi.search(query);
        return response.data || [];
      } catch (error: any) {
        // If search endpoint doesn't exist, fall back to filtering all posts
        if (error.response?.status === 404) {
          try {
            const allPostsResponse = await postsApi.getAll();
            const allPosts = allPostsResponse.data || [];
            return allPosts.filter((post: Post) => 
              post.title.toLowerCase().includes(query.toLowerCase()) ||
              post.excerpt?.toLowerCase().includes(query.toLowerCase()) ||
              post.content?.toLowerCase().includes(query.toLowerCase())
            );
          } catch {
            throw error;
          }
        }
        throw error;
      }
    },
    enabled: !!query.trim(),
  });

  if (!query.trim()) {
    return (
      <div className="content-container">
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex-center mx-auto mb-6">
            <span className="text-slate-400 text-2xl">🔍</span>
          </div>
          <h1 className="text-heading-2 mb-4">Search Articles</h1>
          <p className="text-body mb-6">Use the search bar above to find articles by title, content, or author.</p>
          <Link href="/" className="text-slate-600 hover:text-slate-800 underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <div className="mb-8">
        <h1 className="text-heading-2 mb-2">
          Search Results for "{query}"
        </h1>
        {searchResults && !isLoading && (
          <p className="text-body">
            {searchResults.length === 0 
              ? 'No articles found'
              : `Found ${searchResults.length} article${searchResults.length !== 1 ? 's' : ''}`
            }
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="card-base h-96 p-6">
                <div className="bg-slate-200 h-48 rounded-xl mb-6" />
                <div className="space-y-3">
                  <div className="bg-slate-200 h-6 rounded w-3/4" />
                  <div className="bg-slate-200 h-4 rounded" />
                  <div className="bg-slate-200 h-4 rounded w-5/6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex-center mx-auto mb-6">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <h3 className="text-heading-3 mb-4 text-slate-800">Search Error</h3>
            <p className="text-body mb-6">
              We encountered an error while searching. This might be because the search feature is not yet set up on the server.
            </p>
            <button 
              onClick={() => refetch()}
              className="px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors duration-300 mr-4"
            >
              Try Again
            </button>
            <Link 
              href="/"
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors duration-300"
            >
              Go Home
            </Link>
          </div>
        </div>
      ) : searchResults && searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {searchResults.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex-center mx-auto mb-6">
              <span className="text-slate-400 text-2xl">🔍</span>
            </div>
            <h3 className="text-heading-3 mb-4 text-slate-800">No Articles Found</h3>
            <p className="text-body mb-6">
              We couldn't find any articles matching "{query}". Try using different keywords or browse our latest articles.
            </p>
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4 text-left">
                <p className="text-sm font-medium text-slate-700 mb-2">Search Tips:</p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Try broader keywords</li>
                  <li>• Check your spelling</li>
                  <li>• Use fewer words</li>
                  <li>• Search for topics instead of specific phrases</li>
                </ul>
              </div>
              <div className="flex gap-3 justify-center">
                <Link 
                  href="/"
                  className="px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors duration-300"
                >
                  Browse All Articles
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="content-container">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-64 mb-4" />
          <div className="h-4 bg-slate-200 rounded w-32 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-base h-96 p-6">
                <div className="bg-slate-200 h-48 rounded-xl mb-6" />
                <div className="space-y-3">
                  <div className="bg-slate-200 h-6 rounded w-3/4" />
                  <div className="bg-slate-200 h-4 rounded" />
                  <div className="bg-slate-200 h-4 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
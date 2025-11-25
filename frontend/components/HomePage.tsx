'use client';

import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PostCard } from './PostCard';
import { Loader, PostCardSkeleton } from './Loader';
import { ErrorBox } from './ErrorBox';
import { postsApi } from '@/lib/api';
import { getStaticImageUrl } from '@/lib/imageUtils';
import type { Post } from '@/lib/types';

export function HomePage({ initialPosts }: { initialPosts?: Post[] }) {
  const { data: posts, isLoading, error, refetch } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await postsApi.getAll();
      return response.data;
    },
    retry: false,
    // Always refetch on mount so auth-dependent fields (isLiked) are correct
    refetchOnMount: true,
    initialData: initialPosts
  });

  // When user navigates with browser back/forward, the page may be restored from bfcache
  // and React may not remount. Listen for popstate and refetch so like state is accurate.
  useEffect(() => {
    const onPop = () => {
      refetch();
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [refetch]);

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("${getStaticImageUrl(
              'ian-schneider-TamMbr4okv4-unsplash.jpg',
              'https://res.cloudinary.com/dwwjx5yd1/image/upload/v1764053163/ian-schneider-TamMbr4okv4-unsplash_gcl7ff.jpg'
            )}")`,
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-32"></div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <main className="content-container bg-gradient-to-br from-orange-50 to-amber-50" role="main">
        <header className="section-spacing text-center">
          <h2 className="text-heading-2 mb-4 text-amber-900">Recent Posts</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full mx-auto mb-8 shadow-sm" />
        </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="card-base h-96 p-6 bg-gradient-to-br from-orange-50 to-amber-50">
                <div className="bg-gradient-to-r from-orange-200 to-amber-200 h-48 rounded-xl mb-6 shimmer" />
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-orange-200 to-amber-200 h-6 rounded w-3/4 shimmer" />
                  <div className="bg-gradient-to-r from-orange-200 to-amber-200 h-4 rounded shimmer" />
                  <div className="bg-gradient-to-r from-orange-200 to-amber-200 h-4 rounded w-5/6 shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error && (!posts || posts.length === 0) ? (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-700 to-amber-800 rounded-full flex-center mx-auto mb-6">
              <span className="text-white text-xl">⚠️</span>
            </div>
            <h3 className="text-heading-3 mb-4 text-amber-900">Oops! Something went wrong</h3>
            <ErrorBox message={
              // show API error message when available
              (error as any)?.response?.data?.message || 'Failed to load posts from API.'
            } />
            <button 
              onClick={() => refetch()} 
              className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.map((post, index) => (
            <div key={post.id} className="animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
              <PostCard post={post} index={index} />
            </div>
          ))}
        </div>
      )}
    </main>
    </div>
  );
}



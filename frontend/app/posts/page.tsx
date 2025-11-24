"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { postsApi } from '@/lib/api';
import { PostCard } from '@/components/PostCard';
import { Loader } from '@/components/Loader';
import { ErrorBox } from '@/components/ErrorBox';
import { mockPosts } from '@/lib/mockData';
import type { Post } from '@/lib/types';

export default function PostsPage() {
  const { user, isAuthenticated } = useAuth();

  const { data: posts, isLoading, error, refetch } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await postsApi.getAll();
      return response.data;
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ErrorBox message={(error as any)?.response?.data?.message || 'Failed to load posts.'} />
        <div className="mt-4">
          <button onClick={() => refetch()} className="text-sm text-gray-700 underline">Retry</button>
        </div>
      </div>
    );
  }

  // Show only posts authored by the current user if authenticated
  const myPosts = isAuthenticated && user ? posts?.filter((p) => p.author.id === user.id) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Posts</h1>
        <p className="text-gray-600">Posts you have created</p>
      </div>

      {(!myPosts || myPosts.length === 0) ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-600">You haven't created any posts yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myPosts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { HeartIcon } from 'lucide-react';
import { postsApi } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';

interface LikeButtonProps {
  postId: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
}

const LIKED_POSTS_KEY = 'blog_liked_posts';

// Local storage utilities
const getLikedPosts = (): Set<string> => {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = localStorage.getItem(LIKED_POSTS_KEY);
    return new Set(stored ? JSON.parse(stored) : []);
  } catch {
    return new Set();
  }
};

const setLikedPost = (postId: string, liked: boolean) => {
  if (typeof window === 'undefined') return;
  try {
    const likedPosts = getLikedPosts();
    if (liked) {
      likedPosts.add(postId);
    } else {
      likedPosts.delete(postId);
    }
    localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify([...likedPosts]));
  } catch {
    // Ignore localStorage errors
  }
};

export function LikeButton({ postId, initialLikeCount, initialIsLiked }: LikeButtonProps) {
  // Initialize state from localStorage to ensure persistence
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(() => {
    // Check localStorage first for consistency
    const likedPosts = getLikedPosts();
    return likedPosts.has(postId);
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const queryClient = useQueryClient();

  // Sync with initial data only if localStorage doesn't have this post
  useEffect(() => {
    const likedPosts = getLikedPosts();
    if (!likedPosts.has(postId) && initialIsLiked) {
      // Server says it's liked but localStorage doesn't have it
      // Trust the server and update localStorage
      setIsLiked(true);
      setLikedPost(postId, true);
    }
  }, [postId, initialIsLiked]);

  const handleLike = async () => {
    if (isLoading) return;

    const previousLiked = isLiked;
    const previousCount = likeCount;

    // Optimistic update
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(newLikedState ? likeCount + 1 : likeCount - 1);
    setLikedPost(postId, newLikedState);

    setIsLoading(true);

    try {
      const response = await postsApi.like(postId);
      const { liked, likeCount: serverCount } = response.data;

      // Update with server response
      setIsLiked(liked);
      setLikedPost(postId, liked);
      
      if (typeof serverCount === 'number') {
        setLikeCount(serverCount);
      }

      // Update React Query cache
      queryClient.setQueryData(['posts'], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((post: any) => 
          post.id === postId 
            ? { ...post, isLiked: liked, likeCount: serverCount ?? post.likeCount }
            : post
        );
      });

      queryClient.setQueryData(['post', postId], (oldData: any) => {
        if (!oldData) return oldData;
        return { 
          ...oldData, 
          isLiked: liked, 
          likeCount: serverCount ?? oldData.likeCount 
        };
      });

    } catch (error) {
      // Revert on error
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      setLikedPost(postId, previousLiked);
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleLike}
      disabled={isLoading}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200
        ${isLiked 
          ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <HeartIcon 
        className={`w-5 h-5 transition-all duration-200 ${
          isLiked ? 'fill-current text-red-500' : 'text-gray-500'
        }`} 
      />
      <span className="font-medium">{likeCount}</span>
      {isLoading && (
        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin ml-1" />
      )}
    </motion.button>
  );
}



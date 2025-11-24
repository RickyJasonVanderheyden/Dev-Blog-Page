'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { postsApi } from '@/lib/api';
import { Button } from './Button';
import { PostCard } from './PostCard';
import { Loader } from './Loader';
import { ErrorBox } from './ErrorBox';
import { EditProfileForm } from '@/components/EditProfileForm';
import { UserIcon, EditIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import type { Post } from '@/lib/types';

export function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showEditForm, setShowEditForm] = useState(false);

  // Fetch user's posts
  const {
    data: userPosts,
    isLoading: postsLoading,
    error: postsError,
  } = useQuery<Post[]>({
    queryKey: ['user-posts', user?.id],
    queryFn: async () => {
      try {
        const response = await postsApi.getAll();
        // Filter posts by current user
        return response.data.filter((post: Post) => post.author.id === user?.id);
      } catch (err) {
        console.error('Failed to fetch user posts:', err);
        return [];
      }
    },
    enabled: !!user,
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex-center">
        <div className="text-center max-w-md mx-auto px-4">
          <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-heading-2 mb-3">Sign in required</h2>
          <p className="text-body mb-8">Please sign in to view your profile and posts.</p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/login">
              <Button variant="secondary">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Create Account</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showEditForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="content-container">
          <div className="flex-between mb-8">
            <Button variant="ghost" onClick={() => setShowEditForm(false)}>
              ← Back to Profile
            </Button>
            <h1 className="text-heading-2">Edit Profile</h1>
            <div></div>
          </div>
          <EditProfileForm onSuccess={() => setShowEditForm(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="content-container">
        {/* Profile Header */}
        <div className="card-base p-8 section-spacing">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center lg:items-start">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-gray-100 mb-4"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-100 flex-center ring-4 ring-gray-200 mb-4">
                  <UserIcon className="w-16 h-16 text-gray-500" />
                </div>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowEditForm(true)}
              >
                <EditIcon className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>

            {/* User Info Section */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
                <div className="mb-6 lg:mb-0">
                  <h1 className="text-heading-1 mb-2">{user.username}</h1>
                  <p className="text-body text-gray-600 text-lg mb-2">{user.email}</p>
                  <p className="text-small text-gray-500">
                    Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </p>
                </div>
                <Link href="/posts/create">
                  <Button className="w-full lg:w-auto">
                    <PlusIcon className="w-4 h-4" />
                    Write New Post
                  </Button>
                </Link>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {userPosts?.length || 0}
                  </div>
                  <div className="text-small text-gray-600">Posts</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {userPosts?.reduce((total, post) => total + (post.likeCount || 0), 0) || 0}
                  </div>
                  <div className="text-small text-gray-600">Total Likes</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {userPosts?.filter(post => post.tags && post.tags.length > 0).length || 0}
                  </div>
                  <div className="text-small text-gray-600">Tagged Posts</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="card-base p-8">
          <div className="flex-between mb-6">
            <h2 className="text-heading-2">My Posts</h2>
            <Link href="/posts/create">
              <Button variant="ghost" size="sm">
                <PlusIcon className="w-4 h-4" />
                New Post
              </Button>
            </Link>
          </div>

          {postsLoading ? (
            <div className="flex-center py-12">
              <Loader />
            </div>
          ) : postsError ? (
            <ErrorBox message="Failed to load your posts" />
          ) : !userPosts || userPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex-center mx-auto mb-6">
                  <PlusIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-heading-4 mb-3">No posts yet</h3>
                <p className="text-body mb-6">Start sharing your thoughts and ideas with the world!</p>
                <Link href="/posts/create">
                  <Button>Write Your First Post</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPosts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
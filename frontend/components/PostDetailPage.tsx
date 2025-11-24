'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { CalendarIcon, TagIcon, EditIcon, TrashIcon } from 'lucide-react';
import { Loader } from './Loader';
import { ErrorBox } from './ErrorBox';
import { LikeButton } from './LikeButton';
import { CommentList } from './CommentList';
import { Button } from './Button';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { postsApi } from '@/lib/api';
import type { Post } from '@/lib/types';

export function PostDetailPage({ postId }: { postId: string }) {
  const router = useRouter();
  const { user } = useAuth();

  const {
    data: post,
    isLoading,
    error,
  } = useQuery<Post>({
    queryKey: ['post', postId],
    queryFn: async () => {
      const response = await postsApi.getById(postId);
      return response.data;
    },
  });

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsApi.delete(postId);
        router.push('/');
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="content-container">
        <div className="flex-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="content-container">
        <ErrorBox message="Post not found" />
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const isAuthor = user?.id === post.author.id;

  return (
    <article className="content-container">
      <div className="card-base overflow-hidden">
        {(post.coverImage || post.image) && (
          <div className="w-full h-96 overflow-hidden">
            <img
              src={post.coverImage || post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8">
          <h1 className="text-heading-1 mb-6">{post.title}</h1>

          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.username}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600 font-medium text-lg">
                    {post.author.username[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{post.author.username}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CalendarIcon className="w-4 h-4" />
                  {formattedDate}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <LikeButton
                postId={post.id}
                initialLikeCount={post.likeCount}
                initialIsLiked={post.isLiked}
              />
              {isAuthor && (
                <>
                  <Link href={`/posts/${post.id}/edit`}>
                    <Button variant="secondary" size="sm">
                      <EditIcon className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleDelete}>
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <TagIcon className="w-4 h-4 text-gray-500" />
              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
            <div className="whitespace-pre-wrap text-gray-800">{post.content}</div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <CommentList postId={post.id} />
          </div>
        </div>
      </div>
    </article>
  );
}




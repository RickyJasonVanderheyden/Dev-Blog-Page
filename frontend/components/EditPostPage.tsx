'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { PostEditor } from './PostEditor';
import { ProtectedRoute } from './ProtectedRoute';
import { Loader } from './Loader';
import { ErrorBox } from './ErrorBox';
import { postsApi, uploadsApi } from '@/lib/api';
import type { CreatePostData, Post } from '@/lib/types';

export function EditPostPage({ postId }: { postId: string }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleSubmit = async (data: CreatePostData) => {
    setIsSaving(true);
    setErrorMessage('');
    try {
      const tagsArray = Array.isArray(data.tags) ? data.tags : [];
      const payload: any = {
        ...data,
        tags: tagsArray,
      };

      // handle uploaded file
      try {
        const fileList: FileList | undefined = (data as any).coverImageFile;
        if (fileList && fileList.length > 0) {
          const file = fileList[0];
          const uploadResp = await uploadsApi.upload(file);
          payload.image = uploadResp.data.url;
        }

        await postsApi.update(postId, payload);
      } catch (uploadErr: any) {
        console.error('Upload or update failed:', uploadErr);
        setErrorMessage(uploadErr?.response?.data?.message || uploadErr.message || 'Upload failed');
        setIsSaving(false);
        return;
      }
      router.push(`/posts/${postId}`);
    } catch (error) {
      console.error('Failed to update post:', error);
    } finally {
      setIsSaving(false);
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

  return (
    <ProtectedRoute>
      <div className="content-container">
        <div className="section-spacing">
          <h1 className="text-heading-1 mb-3">Edit Post</h1>
          <p className="text-body">Update your post content</p>
        </div>

        <div className="card-base p-8">
          {errorMessage && <div className="mb-4"><ErrorBox message={errorMessage} /></div>}
          <PostEditor
            initialData={{
              title: post.title,
              content: post.content,
              excerpt: post.excerpt,
              coverImage: post.coverImage || post.image,
              tags: post.tags || [],
            }}
            onSubmit={handleSubmit}
            isLoading={isSaving}
            submitLabel="Update Post"
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}



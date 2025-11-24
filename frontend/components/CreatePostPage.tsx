'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PostEditor } from './PostEditor';
import { ErrorBox } from './ErrorBox';
import { ProtectedRoute } from './ProtectedRoute';
import { postsApi, uploadsApi } from '@/lib/api';
import type { CreatePostData } from '@/lib/types';
import { useQueryClient } from '@tanstack/react-query';

export function CreatePostPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (data: CreatePostData) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const rawTags = (data as any).tags;
      const tagsArray =
        typeof rawTags === 'string'
          ? rawTags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
          : Array.isArray(rawTags)
          ? rawTags
          : [];
      // Map frontend `coverImage` field to backend `image` field if present
      const payload: any = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        tags: tagsArray,
      };

      // support both `coverImage` (URL) and `coverImageFile` (File) coming from the editor
      if ((data as any).coverImage) {
        payload.image = (data as any).coverImage;
      } else if (data.image) {
        payload.image = data.image;
      }

      // If user uploaded a file, upload it first and use returned URL
      try {
        const fileList: FileList | undefined = (data as any).coverImageFile;
        if (fileList && fileList.length > 0) {
          const file = fileList[0];
          const uploadResp = await uploadsApi.upload(file);
          payload.image = uploadResp.data.url;
        }

        const response = await postsApi.create(payload);

        // Invalidate posts cache so recent posts list refreshes
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        router.push(`/posts/${response.data.id}`);
      } catch (uploadErr: any) {
        console.error('Upload or create failed:', uploadErr);
        setErrorMessage(uploadErr?.response?.data?.message || uploadErr.message || 'Upload failed');
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="content-container">
        <div className="section-spacing">
          <h1 className="text-heading-1 mb-3">
            Create New Post
          </h1>
          <p className="text-body">Share your thoughts with the community</p>
        </div>

        <div className="card-base p-8">
          {errorMessage && <div className="mb-4"><ErrorBox message={errorMessage} /></div>}
          <PostEditor
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitLabel="Publish Post"
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}



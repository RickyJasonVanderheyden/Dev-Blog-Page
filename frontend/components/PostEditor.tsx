'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Button } from './Button';
import type { CreatePostData } from '@/lib/types';

interface PostEditorProps {
  initialData?: Partial<CreatePostData>;
  onSubmit: (data: CreatePostData) => Promise<void>;
  isLoading: boolean;
  submitLabel?: string;
}

export function PostEditor({
  initialData,
  onSubmit,
  isLoading,
  submitLabel = 'Publish',
}: PostEditorProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<any>({
    defaultValues: initialData,
  });

  const coverFile = watch('coverImageFile');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Title"
        placeholder="Enter post title..."
        {...register('title', { required: 'Title is required' })}
        error={errors.title?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Cover Image</label>
        <input type="file" accept="image/*" {...register('coverImageFile')} />
        {coverFile && coverFile.length > 0 && (
          <div className="mt-2">
            <img
              src={URL.createObjectURL(coverFile[0])}
              alt="preview"
              className="w-48 h-32 object-cover rounded"
            />
          </div>
        )}
      </div>

      <Textarea
        label="Excerpt"
        placeholder="Brief summary of your post..."
        rows={3}
        {...register('excerpt', { required: 'Excerpt is required' })}
        error={errors.excerpt?.message}
      />

      <Textarea
        label="Content"
        placeholder="Write your post content..."
        rows={12}
        {...register('content', { required: 'Content is required' })}
        error={errors.content?.message}
      />

      <Input
        label="Tags (comma-separated)"
        placeholder="react, typescript, web development"
        {...register('tags')}
        error={errors.tags?.message}
      />

      <div className="flex justify-end gap-3">
        <Button type="submit" isLoading={isLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}



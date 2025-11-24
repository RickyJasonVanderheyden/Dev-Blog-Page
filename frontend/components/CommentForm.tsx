'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from './Button';
import { Textarea } from './Textarea';
import { commentsApi } from '@/lib/api';

interface CommentFormProps {
  postId: string;
  onCommentAdded: () => void;
}

export function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const { isAuthenticated } = useAuth();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await commentsApi.create(postId, content);
      setContent('');
      onCommentAdded();
    } catch (err) {
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-6 text-body">
        Please log in to leave a comment
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        rows={3}
        error={error}
      />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isLoading}>
          Post Comment
        </Button>
      </div>
    </form>
  );
}



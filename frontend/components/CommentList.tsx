'use client';

import React, { useState, useEffect } from 'react';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { commentsApi } from '@/lib/api';
import type { Comment } from '@/lib/types';

interface CommentListProps {
  postId: string;
}

export function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const response = await commentsApi.getByPostId(postId);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleCommentAdded = () => {
    fetchComments();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-heading-4">
        Comments ({comments.length})
      </h3>

      <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />

      {isLoading ? (
        <div className="flex-center py-12">
          <div className="loading-spinner" />
          <span className="ml-2 text-small text-gray-500">Loading comments...</span>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-body py-12">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}



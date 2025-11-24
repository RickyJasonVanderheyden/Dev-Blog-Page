'use client';

import React from 'react';
import type { Comment } from '@/lib/types';

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  const formattedDate = new Date(comment.createdAt).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  );

  return (
    <div className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
      {comment.author.avatar ? (
        <img
          src={comment.author.avatar}
          alt={comment.author.username}
          className="w-10 h-10 rounded-full flex-shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          <span className="text-gray-600 font-medium">
            {comment.author.username[0].toUpperCase()}
          </span>
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-gray-900">
            {comment.author.username}
          </span>
          <span className="text-caption text-gray-500">{formattedDate}</span>
        </div>
        <p className="text-body">{comment.content}</p>
      </div>
    </div>
  );
}



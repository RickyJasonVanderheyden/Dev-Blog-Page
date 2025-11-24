'use client';

import React from 'react';
import { XCircleIcon } from 'lucide-react';

interface ErrorBoxProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBox({ message, onRetry }: ErrorBoxProps) {
  return (
    <div className="status-error p-4 rounded-lg flex items-start gap-3">
      <XCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-red-800">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-small text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}



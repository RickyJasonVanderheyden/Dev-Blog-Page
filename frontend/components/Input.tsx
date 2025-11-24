'use client';

import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'error';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, variant = 'default', className = '', ...props }, ref) => {
    const baseStyles = 'input-base';
    const variants = {
      default: 'border-gray-300 focus:ring-gray-900',
      error: 'border-red-300 focus:ring-red-500 focus:border-red-500',
    };
    
    const currentVariant = error ? 'error' : variant;

    return (
      <div className="w-full">
        {label && (
          <label 
            className="block text-small font-medium text-gray-700 mb-2"
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${baseStyles} ${variants[currentVariant]} ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && (
          <p 
            id={`${props.id}-error`}
            className="mt-2 text-caption text-red-600 flex items-start gap-1"
            role="alert"
            aria-live="polite"
          >
            <span className="inline-block w-1 h-1 bg-red-600 rounded-full mt-1.5 flex-shrink-0" />
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';



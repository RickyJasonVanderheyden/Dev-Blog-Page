'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/lib/api';
import { Input } from './Input';
import { Button } from './Button';
import { ErrorBox } from './ErrorBox';
import type { LoginCredentials } from '@/lib/types';

export function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.login(data);
      login(response.data.user);
      router.push('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex-center px-4">
      <div className="w-full max-w-md">
        <div className="card-base p-8">
          <h1 className="text-heading-2 mb-3">
            Welcome back
          </h1>
          <p className="text-body mb-8">
            Sign in to your account to continue
          </p>

          {error && (
            <div className="mb-6" role="alert" aria-live="assertive">
              <ErrorBox message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="form-group">
            <fieldset>
              <legend className="sr-only">Login credentials</legend>
            <Input
              id="login-email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={errors.email?.message}
            />

            <Input
              id="login-password"
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              error={errors.password?.message}
            />
            </fieldset>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign in
            </Button>
          </form>

          <p className="mt-8 text-center text-small">
            Don't have an account?{' '}
            <a
              href="/auth/register"
              className="text-gray-900 font-medium hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded"
              aria-label="Create a new account"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}



'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { authApi, uploadsApi } from '@/lib/api';
import { Input } from './Input';
import { Button } from './Button';
import { ErrorBox } from './ErrorBox';
import type { RegisterData } from '@/lib/types';

export function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterData & { confirmPassword: string } & { avatarFile?: FileList }>();

  const password = watch('password');
  const avatarFile = watch('avatarFile');

  const onSubmit = async (data: RegisterData & { confirmPassword: string } & { avatarFile?: FileList }) => {
    setIsLoading(true);
    setError('');
    const { confirmPassword, avatarFile, ...registerData } = data as any;

    // If avatar file provided, upload first
    if (avatarFile && avatarFile.length > 0) {
      try {
        const uploadResp = await uploadsApi.upload(avatarFile[0]);
        registerData.avatar = uploadResp.data.url;
      } catch (uploadErr) {
        setError('Failed to upload avatar.');
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await authApi.register(registerData);
      login(response.data.user, response.data.token);
      router.push('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="card-base p-8">
          <h1 className="text-heading-2 mb-3">
            Create account
          </h1>
          <p className="text-body mb-8">
            Join our community of writers and readers
          </p>

          {error && (
            <div className="mb-6">
              <ErrorBox message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="form-group">
            <Input
              label="Username"
              placeholder="johndoe"
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
              })}
              error={errors.username?.message}
            />

            <Input
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

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
              error={errors.confirmPassword?.message}
            />

            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">
                Profile Picture (optional)
              </label>
              <input 
                type="file" 
                accept="image/*" 
                {...register('avatarFile')}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {avatarFile && avatarFile.length > 0 && (
                <div className="mt-3">
                  <img
                    src={URL.createObjectURL(avatarFile[0])}
                    alt="Avatar preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <a
              href="/auth/login"
              className="text-gray-900 font-medium hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}



'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { authApi, uploadsApi } from '@/lib/api';
import { Input } from './Input';
import { Button } from './Button';
import { ErrorBox } from './ErrorBox';
import { UserIcon } from 'lucide-react';

interface ProfileData {
  username: string;
  email: string;
  avatar?: string;
  avatarFile?: FileList;
}

interface EditProfileFormProps {
  onSuccess: () => void;
}

export function EditProfileForm({ onSuccess }: EditProfileFormProps) {
  const { user, updateUser } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ProfileData>({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
    },
  });

  const avatarFile = watch('avatarFile');

  const onSubmit = async (data: ProfileData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedData = {
        username: data.username,
        email: data.email,
        avatar: user?.avatar, // Keep existing avatar initially
      };

      // If new avatar file provided, upload first
      if (data.avatarFile && data.avatarFile.length > 0) {
        try {
          const uploadResp = await uploadsApi.upload(data.avatarFile[0]);
          updatedData.avatar = uploadResp.data.url;
        } catch (uploadErr) {
          setError('Failed to upload avatar.');
          setIsLoading(false);
          return;
        }
      }

      // Update user profile
      const response = await authApi.updateProfile(updatedData);
      updateUser(response.data.user);
      setSuccess('Profile updated successfully!');
      
      // Call success callback after a brief delay to show success message
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center">
        <p className="text-gray-600">Please log in to edit your profile.</p>
      </div>
    );
  }

  return (
    <div className="card-base p-8">
      <div className="mb-8 text-center">
        <div className="relative inline-block mb-6">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-100"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 flex-center ring-4 ring-gray-200">
              <UserIcon className="w-12 h-12 text-gray-500" />
            </div>
          )}
        </div>
        <h2 className="text-heading-2 mb-3">Edit Profile</h2>
        <p className="text-body">Update your profile information and avatar</p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorBox message={error} />
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 status-success rounded-lg">
          <p className="text-green-800 text-small">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form-group">
        <Input
          label="Username"
          placeholder="Enter your username..."
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

        <div>
          <label className="block text-small font-medium text-gray-700 mb-2">
            Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            {...register('avatarFile')}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {avatarFile && avatarFile.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">New profile picture preview:</p>
              <img
                src={URL.createObjectURL(avatarFile[0])}
                alt="Avatar preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button type="submit" isLoading={isLoading}>
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
}
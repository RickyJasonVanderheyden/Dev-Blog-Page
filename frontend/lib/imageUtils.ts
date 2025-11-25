// Image utility functions for handling local and production URLs
export const getImageUrl = (imagePath: string): string => {
  // Check if it's already a full URL (Cloudinary, etc.)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // For local development
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:3001/uploads/${imagePath}`;
  }

  // For production - use environment variable for backend URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
  return `${baseUrl}/uploads/${imagePath}`;
};

// For static assets that should use Cloudinary in production
export const getStaticImageUrl = (imageName: string, cloudinaryUrl?: string): string => {
  // If we have a Cloudinary URL and we're in production, use it
  if (cloudinaryUrl && process.env.NODE_ENV === 'production') {
    return cloudinaryUrl;
  }

  // Otherwise use the regular image URL logic for local development
  return getImageUrl(imageName);
};
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  searchPostsService,
} from '../services/postService';
import { z } from 'zod';

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().min(1).max(500),
  image: z.string().url().optional(),
  tags: z.array(z.string()).optional().default([]),
});

export async function getPosts(req: Request, res: Response) {
  try {
    const userId = (req as any).userId; // From auth middleware if present
    const posts = await getAllPosts(userId);
    res.json(posts);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to fetch posts' });
  }
}

export async function searchPosts(req: Request, res: Response) {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const userId = (req as any).userId; // From auth middleware if present
    const posts = await searchPostsService(q.trim(), userId);
    res.json(posts);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to search posts' });
  }
}

export async function getPost(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = (req as any).userId; // From auth middleware if present
    const post = await getPostById(id, userId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to fetch post' });
  }
}

export async function createPostHandler(req: AuthRequest, res: Response) {
  try {
    const validatedData = createPostSchema.parse(req.body);
    const post = await createPost(validatedData, req.userId!);
    res.status(201).json(post);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }
    res.status(400).json({ message: error.message || 'Failed to create post' });
  }
}

export async function updatePostHandler(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = createPostSchema.partial().parse(req.body);
    const post = await updatePost(id, validatedData);
    res.json(post);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }
    res.status(400).json({ message: error.message || 'Failed to update post' });
  }
}

export async function deletePostHandler(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    await deletePost(id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to delete post' });
  }
}

export async function likePostHandler(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const result = await likePost(id, req.userId!);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to toggle like' });
  }
}
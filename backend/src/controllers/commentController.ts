import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { getCommentsByPostId, createComment } from '../services/commentService';
import { z } from 'zod';

const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
});

export async function getComments(req: AuthRequest, res: Response) {
  try {
    const { postId } = req.params;
    const comments = await getCommentsByPostId(postId);
    res.json(comments);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch comments' });
  }
}

export async function createCommentHandler(req: AuthRequest, res: Response) {
  try {
    const { postId } = req.params;
    const validatedData = createCommentSchema.parse(req.body);
    const comment = await createComment(postId, validatedData, req.userId!);
    res.status(201).json(comment);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors,
      });
    }
    res.status(400).json({ message: error.message || 'Failed to create comment' });
  }
}



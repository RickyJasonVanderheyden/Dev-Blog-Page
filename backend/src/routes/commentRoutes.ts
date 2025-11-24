import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { getComments, createCommentHandler } from '../controllers/commentController';

const router = Router();

router.get('/:postId/comments', getComments);
router.post('/:postId/comments', authMiddleware, createCommentHandler);

export default router;


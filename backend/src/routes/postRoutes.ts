import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  getPosts,
  getPost,
  createPostHandler,
  updatePostHandler,
  deletePostHandler,
  likePostHandler,
  searchPosts,
} from '../controllers/postController';

const router = Router();

router.get('/', getPosts);
router.get('/search', searchPosts);
router.get('/:id', getPost);
router.post('/', authMiddleware, createPostHandler);
router.put('/:id', authMiddleware, updatePostHandler);
router.delete('/:id', authMiddleware, deletePostHandler);
router.post('/:id/like', authMiddleware, likePostHandler);

export default router;
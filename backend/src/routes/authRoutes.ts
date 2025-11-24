import { Router } from 'express';
import { register, login, updateProfileHandler } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.put('/profile', authMiddleware, updateProfileHandler);

export default router;



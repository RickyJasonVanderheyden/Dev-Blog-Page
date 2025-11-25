import { Router } from 'express';
import { upload, uploadFile } from '../controllers/uploadController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public upload for registration (no auth required)
router.post('/register', upload.single('file'), uploadFile);

// Authenticated upload for logged-in users
router.post('/', authMiddleware, upload.single('file'), uploadFile);

export default router;

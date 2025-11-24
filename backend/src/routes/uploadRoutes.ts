import { Router } from 'express';
import { upload, uploadFile } from '../controllers/uploadController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Add authentication to uploads - only logged-in users can upload
router.post('/', authMiddleware, upload.single('file'), uploadFile);

export default router;

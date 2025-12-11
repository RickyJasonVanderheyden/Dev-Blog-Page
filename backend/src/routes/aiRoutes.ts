import { Router } from 'express';
import { chatHandler, testApiHandler } from '../controllers/aiController';

const router = Router();

// POST /api/ai/chat
router.post('/chat', chatHandler);

// GET /api/ai/test - Test if API key works
router.get('/test', testApiHandler);

export default router;
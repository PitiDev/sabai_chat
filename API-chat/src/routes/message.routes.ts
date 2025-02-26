import { Router } from 'express';
import { MessageController } from '../controllers/message.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// กำหนด routes พร้อม middleware authentication
router.get('/:userId', authenticateToken, MessageController.getMessages);
router.post('/', authenticateToken, MessageController.sendMessage);
router.put('/read', authenticateToken, MessageController.markAsRead);
router.get('/unread/count', authenticateToken, MessageController.getUnreadCount);

export default router;
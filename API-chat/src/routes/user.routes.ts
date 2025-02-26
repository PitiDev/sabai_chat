import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, UserController.getAllUsers);
router.get('/search', authenticateToken, UserController.searchUsers);
router.put('/avatar', authenticateToken, UserController.updateAvatar);

export default router;
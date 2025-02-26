import express from 'express';
import authRoutes from './auth.routes';
import messageRoutes from './message.routes';
import userRoutes from './user.routes';
import fileRoutes from './file.routes';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/messages', messageRoutes);
router.use('/users', userRoutes);
router.use('/files', fileRoutes);
export default router;
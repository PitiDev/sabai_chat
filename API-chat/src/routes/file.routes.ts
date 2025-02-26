// routes/file.routes.ts
import { Router } from 'express';
import { FileController } from '../controllers/file.controller';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/upload', authenticateToken, upload.single('file'), FileController.uploadFile);

export default router;
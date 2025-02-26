// routes/upload.routes.ts
import { Router } from 'express';
import { upload } from '../middleware/upload';
import { FileController } from '../controllers/file.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// ใช้ multer สำหรับการอัพโหลดไฟล์โดยเฉพาะ
router.post('/image', authenticateToken, upload.single('image'), FileController.uploadFile);

export default router;
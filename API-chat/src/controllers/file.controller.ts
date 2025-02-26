// controllers/file.controller.ts
import { RequestHandler, Request } from 'express';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

export class FileController {
    static uploadFile: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            res.status(200).json({
                message: 'File uploaded successfully',
                fileUrl: `/uploads/${req.file.filename}`,
                fileName: req.file.originalname,
                fileType: req.file.mimetype
            });
        } catch (error) {
            console.error('File upload error:', error);
            res.status(500).json({
                message: 'Internal server error',
                error: (error as Error).message
            });
        }
    };
}
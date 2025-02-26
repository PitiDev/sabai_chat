import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';

export const authenticateToken: RequestHandler = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            res.status(401).json({ message: 'Access token is required' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
        
        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            res.status(403).json({ message: 'Invalid user' });
            return;
        }

        (req as any).user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(403).json({ message: 'Invalid token' });
            return;
        }
        next(error);
    }
};
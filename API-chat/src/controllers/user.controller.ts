import { RequestHandler } from 'express';
import { UserModel } from '../models/user.model';

export class UserController {
  static getAllUsers: RequestHandler = async (req, res, next) => {
    try {
      const currentUserId = (req as any).user.id;
      const users = await UserModel.getAllUsers(currentUserId);

      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  static searchUsers: RequestHandler = async (req, res, next) => {
    try {
      const { query } = req.query;
      const currentUserId = (req as any).user.id;

      if (!query || typeof query !== 'string') {
        res.status(400).json({ message: 'Search query is required' });
        return;
      }

      const users = await UserModel.searchUsers(query, currentUserId);
      res.json(users);
    } catch (error) {
      next(error);
    }
  };


  static updateAvatar: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { backgroundColor, icon } = req.body;

      if (!backgroundColor) {
        res.status(400).json({ message: 'Background color is required' });
        return;
      }

      // สร้าง avatar ในรูปแบบ JSON string
      const avatarData = JSON.stringify({
        backgroundColor,
        icon: icon || ''
      });

      // อัพเดทในฐานข้อมูล
      await UserModel.updateAvatar(userId, avatarData);

      res.json({
        success: true,
        message: 'Avatar updated successfully',
        avatar: { backgroundColor, icon }
      });
    } catch (error) {
      next(error);
    }
  };

}
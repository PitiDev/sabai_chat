import { RequestHandler } from 'express';
import { MessageModel } from '../models/message.model';

export class MessageController {
  static getMessages: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const currentUserId = (req as any).user.id;

      if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }

      const messages = await MessageModel.getMessages(currentUserId, userId);
      res.json(messages);
    } catch (error) {
      next(error);
    }
  };

  static sendMessage: RequestHandler = async (req, res, next) => {
    try {
      const { receiverId, content, messageType = 'text', fileUrl = null } = req.body;
      const senderId = (req as any).user.id;

      if (!receiverId || !content) {
        res.status(400).json({ message: 'Receiver ID and content are required' });
        return;
      }

      const message = await MessageModel.create({
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        message_type: messageType as 'text' | 'file',
        file_url: fileUrl
      });

      

      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  };

  static markAsRead: RequestHandler = async (req, res, next) => {
    try {
      const { messageIds } = req.body;

      if (!messageIds || !Array.isArray(messageIds) || !messageIds.length) {
        res.status(400).json({ message: 'Message IDs array is required' });
        return;
      }

      await MessageModel.markAsRead(messageIds);
      res.json({ message: 'Messages marked as read' });
    } catch (error) {
      next(error);
    }
  };

  static getUnreadCount: RequestHandler = async (req, res, next) => {
    try {
      const userId = (req as any).user.id;
      const count = await MessageModel.getUnreadCount(userId);
      res.json({ count });
    } catch (error) {
      next(error);
    }
  };
}
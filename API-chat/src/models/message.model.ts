import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: 'text' | 'file';
  file_url?: string | null;
  is_read: boolean;

}

export class MessageModel {
  static async create(data: {
    sender_id: string;
    receiver_id: string;
    content: string;
    message_type?: 'text' | 'image' | 'file';
    file_url?: string | null;

  }): Promise<Message> {
    try {
      const id = uuidv4();
      const { sender_id, receiver_id, content, message_type = 'text', file_url } = data;

      const fields = ['id', 'sender_id', 'receiver_id', 'content', 'message_type'];
      const values: (string | null)[] = [id, sender_id, receiver_id, content, message_type];

      if (file_url !== undefined) {
        fields.push('file_url');
        values.push(file_url);
      }

      const query = `
        INSERT INTO messages (${fields.join(', ')}, is_read)
        VALUES (${fields.map(() => '?').join(', ')}, false)
      `;

      await pool.execute(query, values);

      const [result] = await pool.execute(
        'SELECT * FROM messages WHERE id = ?',
        [id]
      );

      return (result as Message[])[0];
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

// ในไฟล์ message.model.ts (backend)
static async getMessages(userId1: string, userId2: string, limit = 50): Promise<Message[]> {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM messages 
       WHERE (sender_id = ? AND receiver_id = ?)
          OR (sender_id = ? AND receiver_id = ?)
       ORDER BY created_at ASC  /* เรียงจากเก่าไปใหม่ */
       LIMIT ?`,
      [userId1, userId2, userId2, userId1, limit]
    );
    return rows as Message[];
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
}

  static async markAsRead(messageIds: string[]): Promise<void> {
    try {
      if (!messageIds.length) return;
      
      const placeholders = messageIds.map(() => '?').join(',');
      await pool.execute(
        `UPDATE messages SET is_read = true 
         WHERE id IN (${placeholders})`,
        messageIds
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const [rows] = await pool.execute(
        `SELECT COUNT(*) as count 
         FROM messages 
         WHERE receiver_id = ? AND is_read = false`,
        [userId]
      );
      return (rows as [{count: number}])[0].count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }
}
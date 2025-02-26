import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';
import { User } from '../types/user';

export class UserModel {
  static async findById(id: string): Promise<User | null> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return (rows as User[])[0] || null;
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return (rows as User[])[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async create(data: {
    email: string;
    password_hash: string;
    name: string;
    avatar_url?: string | null;
  }): Promise<User> {
    try {
      const id = uuidv4();
      const { email, password_hash, name, avatar_url } = data;

      // สร้าง query แบบมีเงื่อนไข
      const fields = ['id', 'email', 'password_hash', 'name'];
      const values: (string | null)[] = [id, email, password_hash, name];

      if (avatar_url !== undefined) {
        fields.push('avatar_url');
        values.push(avatar_url);
      }

      const query = `
        INSERT INTO users (${fields.join(', ')}, is_online) 
        VALUES (${fields.map(() => '?').join(', ')}, false)
      `;

      await pool.execute(query, values);

      const user = await this.findById(id);
      if (!user) throw new Error('User creation failed');

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async updateOnlineStatus(id: string, isOnline: boolean): Promise<void> {
    try {
      await pool.execute(
        'UPDATE users SET is_online = ?, last_seen = CURRENT_TIMESTAMP WHERE id = ?',
        [isOnline, id]
      );
    } catch (error) {
      console.error('Error updating online status:', error);
      throw error;
    }
  }

  static async getOnlineUsers(): Promise<User[]> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE is_online = true'
      );
      return rows as User[];
    } catch (error) {
      console.error('Error getting online users:', error);
      throw error;
    }
  }

  static async getAllUsers(currentUserId: string): Promise<User[]> {
    try {
      const [rows] = await pool.execute(
        `SELECT 
          id, 
          name, 
          email, 
          avatar_url, 
          is_online,
          last_seen,
          avatar_data,
          (SELECT COUNT(*) 
           FROM messages 
           WHERE messages.sender_id = users.id 
           AND messages.receiver_id = ? 
           AND messages.is_read = false) as unread_count
        FROM users 
        WHERE id != ?
        ORDER BY is_online DESC, name ASC`,
        [currentUserId, currentUserId]
      );

      return rows as User[];
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  static async searchUsers(searchTerm: string, currentUserId: string): Promise<User[]> {
    try {
      const [rows] = await pool.execute(
        `SELECT 
          id, 
          name, 
          email, 
          avatar_url, 
          is_online,
          last_seen,
          avatar_data
        FROM users 
        WHERE id != ? 
        AND (name LIKE ? OR email LIKE ?)
        ORDER BY is_online DESC, name ASC`,
        [currentUserId, `%${searchTerm}%`, `%${searchTerm}%`]
      );

      return rows as User[];
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return (rows as User[])[0] || null;
    } catch (error) {
      console.error('Error getting user by id:', error);
      throw error;
    }
  }

  static async updateAvatar(userId: string, avatarData: string): Promise<void> {
    try {
      await pool.execute(
        'UPDATE users SET avatar_data = ? WHERE id = ?',
        [avatarData, userId]
      );
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  }

}
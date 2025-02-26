import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { MessageModel } from '../models/message.model';

export class SocketService {
  private io: Server;
  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  constructor(io: Server) {
    this.io = io;
    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    this.io.use(async (socket: Socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
        socket.data.userId = decoded.userId;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', async (socket: Socket) => {
      const userId = socket.data.userId;

      // Update user's online status
      await UserModel.updateOnlineStatus(userId, true);
      this.userSockets.set(userId, socket.id);

      // Broadcast online status
      this.broadcastOnlineUsers();

      // Handle message sending
      socket.on('message:send', async (data) => {
        try {
          const userId = socket.data.userId;

          // บันทึกข้อความในฐานข้อมูล
          const message = await MessageModel.create({
            sender_id: userId,
            receiver_id: data.receiverId,
            content: data.content,
            message_type: data.messageType || 'text',
            file_url: data.fileUrl,


          });

          // ส่งข้อความไปยังผู้รับ
          const receiverSocketId = this.userSockets.get(data.receiverId);
          if (receiverSocketId) {
            this.io.to(receiverSocketId).emit('message:received', message);
          }

          // ส่งข้อความกลับไปยังผู้ส่ง (ถ้าต้องการ) เพื่อให้มี ID ที่แท้จริง
          socket.emit('message:sent', message);
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('message:error', { error: 'Failed to send message' });
        }
      });

      // Handle typing status
      socket.on('typing', (data: { receiverId: string }) => {
        const receiverSocketId = this.userSockets.get(data.receiverId);
        if (receiverSocketId) {
          this.io.to(receiverSocketId).emit('user:typing', { userId });
        }
      });

      // เมื่อผู้ใช้ส่ง event typing:stop
      socket.on('typing:stop', (data) => {
        const { receiverId } = data;
        const receiverSocket = this.userSockets.get(receiverId);
        if (receiverSocket) {
          this.io.to(receiverSocket).emit('user:typing:stop', { userId: socket.data.userId });
        }
      });

      // Handle disconnect
      socket.on('disconnect', async () => {
        await UserModel.updateOnlineStatus(userId, false);
        this.userSockets.delete(userId);
        this.broadcastOnlineUsers();
      });
    });


  }


  // ฟังก์ชันสำหรับส่งรายชื่อผู้ใช้ที่ออนไลน์
  private async broadcastOnlineUsers() {
    try {
      // ดึงรายชื่อผู้ใช้ที่ออนไลน์จากฐานข้อมูล
      const onlineUsers = await UserModel.getOnlineUsers();
      const onlineUserIds = onlineUsers.map(user => user.id);

      // ส่งให้ทุกคลาย
      this.io.emit('users:online', onlineUserIds);
    } catch (error) {
      console.error('Error broadcasting online users:', error);
    }
  }
}
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import apiRoutes from './src/routes/api';
import { SocketService } from './src/services/socket.service';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'], // เพิ่ม origin ของ frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Socket.IO configuration
const io = new Server(httpServer, {
  cors: corsOptions
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = path.resolve('./uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(uploadDir));
// Test route
app.get('/', (req, res) => {
  res.send('Chat API is running');
});

// Routes
app.use('/api', apiRoutes);

// Initialize Socket.IO
new SocketService(io);

const PORT = process.env.PORT || 8000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
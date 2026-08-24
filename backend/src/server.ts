import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { connectDB } from './config/db';
import jwt from 'jsonwebtoken';
import * as messageService from './services/messageService';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
import cookie from 'cookie';
// ... existing imports ...

// ...
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }
});

(app as any).io = io;

// Socket Auth Middleware
io.use((socket, next) => {
  const cookies = cookie.parse(socket.handshake.headers.cookie || '');
  const token = cookies.jwt; // Assuming the cookie name is 'jwt'
  
  if (!token) return next(new Error('Authentication error'));
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET environment variable is not defined');
    
    const decoded = jwt.verify(token, secret) as { userId: string };
    (socket as any).userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});
// ...

io.on('connection', (socket) => {
  const userId = (socket as any).userId;
  socket.join(userId); // Join user room for notifications
  console.log('User connected:', userId);
  
  socket.on('join_conversation', (convId) => socket.join(convId));
  socket.on('send_message', async (data) => {
    // Logic to save message and emit to conversation
    const { conversationId, content } = data;
    const senderId = (socket as any).userId;
    const message = await messageService.createMessage(conversationId, senderId, content);
    io.to(conversationId).emit('receive_message', message);
  });
});

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();

//C:\Users\kygao\global-chat-backend\src\socket\index.ts

import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { ChatModel } from '../models/Chat';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const setupSocketHandlers = (io: Server) => {
  // Middleware for socket authentication
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        throw new Error('Authentication error');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      const user = await UserModel.findById(decoded.userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.userId}`);

    // Update user's online status
    if (socket.userId) {
      await UserModel.findByIdAndUpdate(socket.userId, {
        lastOnline: new Date()
      });
    }

    // Handle broadcasting message
    socket.on('broadcast', async (data: { message: string }) => {
      const user = await UserModel.findById(socket.userId);
      if (user) {
        io.emit('newBroadcast', {
          userId: socket.userId,
          message: data.message.substring(0, 10), // First 10 characters
          location: user.location
        });
      }
    });

    // Handle private chat
    socket.on('joinChat', async (chatId: string) => {
      socket.join(`chat:${chatId}`);
    });

    socket.on('sendMessage', async (data: { chatId: string, content: string }) => {
      if (!socket.userId) return;

      try {
        const chat = await ChatModel.findById(data.chatId);
        if (!chat || !chat.participants.includes(socket.userId)) {
          return;
        }

        const message = {
          senderId: socket.userId,
          content: data.content,
          timestamp: new Date()
        };

        chat.messages.push(message);
        await chat.save();

        io.to(`chat:${data.chatId}`).emit('newMessage', message);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    socket.on('disconnect', async () => {
      if (socket.userId) {
        await UserModel.findByIdAndUpdate(socket.userId, {
          lastOnline: new Date()
        });
      }
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
};
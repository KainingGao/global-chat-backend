//C:\Users\kygao\global-chat-backend\src\routes\index.ts

import { Express } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import chatRoutes from './chat';
import souvenirRoutes from './souvenir';

export const setupRoutes = (app: Express) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/chats', chatRoutes);
  app.use('/api/souvenirs', souvenirRoutes);
};
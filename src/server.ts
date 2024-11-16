//C:\Users\kygao\global-chat-backend\src\server.ts

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { setupRoutes } from './routes';
import { setupSocketHandlers } from './socket';
import { startTicketRefillService } from './services/ticketRefill';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://your-production-domain.com' 
      : 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com', 'https://your-china-domain.com']
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start ticket refill service after DB connection
    startTicketRefillService();
  })
  .catch((error) => console.error('MongoDB connection error:', error));

// Setup routes
setupRoutes(app);

// Setup Socket.io handlers
setupSocketHandlers(io);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  
  // First close the HTTP server
  httpServer.close(() => {
    console.log('HTTP server closed.');
    
    // Then close MongoDB connection
    mongoose.connection.close()
      .then(() => {
        console.log('MongoDB connection closed.');
        process.exit(); // No arguments needed
      })
      .catch((err) => {
        console.error('Error during shutdown:', err);
        process.exit(1);
      });
  });

  // Fallback force-quit
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
});
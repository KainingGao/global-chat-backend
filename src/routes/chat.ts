//C:\Users\kygao\global-chat-backend\src\routes\chat.ts

import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { createChat, getChat, getUserChats } from '../controllers/chat';

const router = express.Router();

router.post('/', 
  authenticate,
  [
    body('participantId').exists().isString(),
  ],
  validateRequest,
  createChat
);

router.get('/', authenticate, getUserChats);
router.get('/:chatId', authenticate, getChat);

export default router;
//C:\Users\kygao\global-chat-backend\src\routes\souvenir.ts

import express from 'express';
import { drawSouvenir, exchangeSouvenir } from '../controllers/souvenir';
import { authenticate } from '../middleware/auth';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate';

const router = express.Router();

router.post('/draw', authenticate, drawSouvenir);

router.post('/exchange',
  authenticate,
  [
    body('souvenirId').exists(),
    body('receiverId').exists(),
    body('chatId').exists()
  ],
  validateRequest,
  exchangeSouvenir
);

export default router;
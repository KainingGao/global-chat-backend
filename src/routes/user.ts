//C:\Users\kygao\global-chat-backend\src\routes\user.ts

import express from 'express';
import { getProfile, updateLocation } from '../controllers/user';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.put('/location', authenticate, updateLocation);

export default router;
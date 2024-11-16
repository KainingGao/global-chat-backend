//C:\Users\kygao\global-chat-backend\src\routes\auth.ts

import express from 'express';
import { body } from 'express-validator';
import { register, login, logout } from '../controllers/auth';
import { validateRequest } from '../middleware/validate';

const router = express.Router();

router.post('/register',
  [
    body('username').trim().isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('location').isObject()
  ],
  validateRequest,
  register
);

router.post('/login',
  [
    body('email').isEmail(),
    body('password').exists()
  ],
  validateRequest,
  login
);

router.post('/logout', logout);

export default router;
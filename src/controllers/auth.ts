//C:\Users\kygao\global-chat-backend\src\controllers\auth.ts

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, location } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email or username already exists' 
      });
    }

    const user = new UserModel({
        username,
        email,
        password,
        location,
        tickets: 5,
        lastOnline: new Date()
      });
  
      await user.save();
  
      // Generate token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );
  
      res.status(201).json({ user, token });
    } catch (error) {
      res.status(500).json({ error: 'Error creating user' });
    }
  };
  
  export const login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
  
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Update last online
      user.lastOnline = new Date();
      await user.save();
  
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );
  
      res.json({ user, token });
    } catch (error) {
      res.status(500).json({ error: 'Error logging in' });
    }
  };
  
  export const logout = async (req: Request, res: Response) => {
    // In a token-based system, the client should discard the token
    res.json({ message: 'Logged out successfully' });
  };
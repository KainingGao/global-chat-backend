//C:\Users\kygao\global-chat-backend\src\controllers\user.ts

import { Request, Response } from 'express';
import { UserModel } from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.user._id)
      .select('-password')
      .populate('friends', 'username location lastOnline');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching profile' });
  }
};

export const updateLocation = async (req: AuthRequest, res: Response) => {
  try {
    const { lat, lon, country, state, city } = req.body;
    
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.location = { lat, lon, country, state, city };
    await user.save();

    res.json({ message: 'Location updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating location' });
  }
};
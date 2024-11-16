//C:\Users\kygao\global-chat-backend\src\controllers\chat.ts

import { Request, Response } from 'express';
import { ChatModel } from '../models/Chat';
import { UserModel } from '../models/User';
import { Chat, User } from '../types';

interface AuthRequest extends Request {
  user?: any;
}

interface PopulatedParticipant extends User {
  _id: string;
}

interface PopulatedChat extends Omit<Chat, 'participants'> {
  participants: PopulatedParticipant[];
}

interface AuthRequest extends Request {
  user?: any;
}

export const createChat = async (req: AuthRequest, res: Response) => {
  try {
    const { participantId } = req.body;
    const userId = req.user._id;

    // Check if chat already exists between these users
    const existingChat = await ChatModel.findOne({
      participants: { 
        $all: [userId, participantId],
        $size: 2
      }
    });

    if (existingChat) {
      return res.json(existingChat);
    }

    // Verify participant exists
    const participant = await UserModel.findById(participantId);
    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    const chat = new ChatModel({
      participants: [userId, participantId],
      messages: [],
      souvenirExchanged: false
    });

    await chat.save();

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Error creating chat' });
  }
};

export const getChat = async (req: AuthRequest, res: Response) => {
  try {
    const chat = await ChatModel.findById(req.params.chatId)
      .populate('participants', 'username location lastOnline') as PopulatedChat;

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Verify user is participant
    if (!chat.participants.some(p => p._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ error: 'Not authorized to access this chat' });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chat' });
  }
};

export const getUserChats = async (req: AuthRequest, res: Response) => {
  try {
    const chats = await ChatModel.find({
      participants: req.user._id
    })
      .populate('participants', 'username location lastOnline')
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chats' });
  }
};
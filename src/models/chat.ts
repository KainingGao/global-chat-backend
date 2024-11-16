//C:\Users\kygao\global-chat-backend\src\models\Chat.ts

import mongoose, { Schema } from 'mongoose';
import { Chat } from '../types';

const chatSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [{
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  souvenirExchanged: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const ChatModel = mongoose.model<Chat>('Chat', chatSchema);
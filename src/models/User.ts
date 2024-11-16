//C:\Users\kygao\global-chat-backend\src\models\User.ts

import mongoose, { Schema, Document } from 'mongoose';
import { User, UserSouvenir} from '../types';
import bcrypt from 'bcryptjs';

interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  location: {
    lat: number;
    lon: number;
    country: string;
    state: string;
    city: string;
  };
  tickets: number;
  lastOnline: Date;
  souvenirCollection: UserSouvenir[];  // Changed from string[] to UserSouvenir[]
  backpack: UserSouvenir[]; 
  friends: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true }
  },
  tickets: { type: Number, default: 5 },
  lastOnline: { type: Date, default: Date.now },
  souvenirCollection: [{
    sId: Number,
    name: String,
    tier: {
      type: String,
      enum: ['d', 'c', 'b', 'a', 's']
    },
    lat: Number,
    lon: Number,
    country: String,
    state: String,
    city: String,
    ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
    giverId: { type: Schema.Types.ObjectId, ref: 'User' },
    obtainedAt: { type: Date, default: Date.now }
  }],
  backpack: [{
    sId: Number,
    name: String,
    tier: {
      type: String,
      enum: ['d', 'c', 'b', 'a', 's']
    },
    lat: Number,
    lon: Number,
    country: String,
    state: String,
    city: String,
    ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
    giverId: { type: Schema.Types.ObjectId, ref: 'User' },
    obtainedAt: { type: Date, default: Date.now }
  }],
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
//C:\Users\kygao\global-chat-backend\src\models\Souvenir.ts

import mongoose, { Schema } from 'mongoose';
import { Souvenir } from '../types';



const souvenirSchema = new Schema({
  sId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  tier: { 
    type: String, 
    required: true,
    enum: ['d', 'c', 'b', 'a', 's']
  },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true }
});

export const SouvenirModel = mongoose.model<Souvenir>('Souvenir', souvenirSchema);
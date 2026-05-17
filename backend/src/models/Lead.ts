import mongoose, { Schema } from 'mongoose';
import { ILead } from '../interfaces';
import { LEAD_STATUS, LEAD_SOURCE } from '../constants';

const leadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true, index: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    status: { type: String, enum: LEAD_STATUS, default: 'New' },
    source: { type: String, enum: LEAD_SOURCE, required: true },
  },
  { timestamps: true }
);

leadSchema.index({ name: 'text', email: 'text' });

export const Lead = mongoose.model<ILead>('Lead', leadSchema);

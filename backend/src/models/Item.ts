import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IItem extends Document {
  owner: Types.ObjectId;
  title: string;
  description: string;
  category: string;
  images: string[];
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  borrowingFee: number;
  securityDeposit: number;
  availability: {
    startDate: Date;
    endDate: Date;
  };
  status: 'Available' | 'Borrowed' | 'Maintenance';
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<IItem>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    images: { type: [String], required: true },
    condition: { 
      type: String, 
      enum: ['New', 'Like New', 'Good', 'Fair'], 
      required: true 
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point'
      },
      coordinates: { type: [Number], required: true }
    },
    borrowingFee: { type: Number, required: true, min: 0 },
    securityDeposit: { type: Number, required: true, min: 0 },
    availability: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true }
    },
    status: { 
      type: String, 
      enum: ['Available', 'Borrowed', 'Maintenance'], 
      default: 'Available' 
    }
  },
  { timestamps: true }
);

// Indexes
itemSchema.index({ location: '2dsphere' });

export const Item = mongoose.model<IItem>('Item', itemSchema);

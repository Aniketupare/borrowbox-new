import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReview extends Document {
  reviewer: Types.ObjectId;
  reviewee: Types.ObjectId;
  item: Types.ObjectId;
  booking: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reviewee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    rating: { 
      type: Number, 
      required: true, 
      min: [1, 'Rating must be at least 1'], 
      max: [5, 'Rating must be at most 5'] 
    },
    comment: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

// One review per user per completed booking
reviewSchema.index({ reviewer: 1, booking: 1 }, { unique: true });

// Useful indexes
reviewSchema.index({ reviewee: 1 });
reviewSchema.index({ item: 1 });

export const Review = mongoose.model<IReview>('Review', reviewSchema);

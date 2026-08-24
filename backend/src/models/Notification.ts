import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INotification extends Document {
  user: Types.ObjectId;
  type: 'BORROW_REQUEST' | 'BOOKING_UPDATE' | 'REVIEW' | 'DAMAGE_REPORT' | 'DISPUTE' | 'MESSAGE';
  content: string;
  isRead: boolean;
  referenceId: Types.ObjectId;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
      type: String, 
      enum: ['BORROW_REQUEST', 'BOOKING_UPDATE', 'REVIEW', 'DAMAGE_REPORT', 'DISPUTE', 'MESSAGE'], 
      required: true 
    },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    referenceId: { type: Schema.Types.ObjectId, required: true }
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, isRead: 1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);

import mongoose, { Schema, Document, Types } from 'mongoose';

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  ACTIVE = 'ACTIVE',
  RETURNED = 'RETURNED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED'
}

export interface IBooking extends Document {
  item: Types.ObjectId;
  borrower: Types.ObjectId;
  owner: Types.ObjectId;
  borrowRequest: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
  securityDeposit: number;
  borrowingFee: number;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    borrower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    borrowRequest: { type: Schema.Types.ObjectId, ref: 'BorrowRequest', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { 
      type: String, 
      enum: Object.values(BookingStatus), 
      default: BookingStatus.CONFIRMED 
    },
    securityDeposit: { type: Number, required: true, min: 0 },
    borrowingFee: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

// Indexes for query performance and date range checks
bookingSchema.index({ item: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ borrower: 1 });
bookingSchema.index({ owner: 1 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);

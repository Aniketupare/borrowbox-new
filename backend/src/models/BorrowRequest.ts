import mongoose, { Schema, Document, Types } from 'mongoose';

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export interface IBorrowRequest extends Document {
  item: Types.ObjectId;
  borrower: Types.ObjectId;
  owner: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  message: string;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

const borrowRequestSchema = new Schema<IBorrowRequest>(
  {
    item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    borrower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    message: { type: String },
    status: { 
      type: String, 
      enum: Object.values(RequestStatus), 
      default: RequestStatus.PENDING 
    }
  },
  { timestamps: true }
);

// Indexes for query performance and overlapping request checks
borrowRequestSchema.index({ item: 1, startDate: 1, endDate: 1 });
borrowRequestSchema.index({ borrower: 1 });
borrowRequestSchema.index({ owner: 1 });

export const BorrowRequest = mongoose.model<IBorrowRequest>('BorrowRequest', borrowRequestSchema);

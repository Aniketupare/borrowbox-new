import mongoose, { Schema, Document, Types } from 'mongoose';
import { ReportStatus, ResolutionType } from './DamageReport';

export interface IDispute extends Document {
  damageReport: Types.ObjectId;
  booking: Types.ObjectId;
  raisedBy: Types.ObjectId;
  against: Types.ObjectId;
  reason: string;
  evidence: string[];
  status: ReportStatus;
  resolution?: ResolutionType;
  resolvedBy?: Types.ObjectId;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const disputeSchema = new Schema<IDispute>(
  {
    damageReport: { type: Schema.Types.ObjectId, ref: 'DamageReport', required: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    raisedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    against: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    evidence: { type: [String], default: [] },
    status: { type: String, enum: Object.values(ReportStatus), default: ReportStatus.OPEN },
    resolution: { type: String, enum: Object.values(ResolutionType) },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date }
  },
  { timestamps: true }
);

// Indexes
disputeSchema.index({ damageReport: 1 });
disputeSchema.index({ booking: 1 });
disputeSchema.index({ status: 1 });
disputeSchema.index({ raisedBy: 1 });
disputeSchema.index({ against: 1 });

export const Dispute = mongoose.model<IDispute>('Dispute', disputeSchema);

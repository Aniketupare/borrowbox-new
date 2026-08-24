import mongoose, { Schema, Document, Types } from 'mongoose';

export enum DamageType {
  MINOR = 'MINOR',
  MAJOR = 'MAJOR',
  MISSING_PART = 'MISSING_PART',
  LOST = 'LOST',
  OTHER = 'OTHER'
}

export enum ReportStatus {
  OPEN = 'OPEN',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED'
}

export enum ResolutionType {
  NONE = 'NONE',
  DEPOSIT_DEDUCTED = 'DEPOSIT_DEDUCTED',
  NO_DEDUCTION = 'NO_DEDUCTION',
  MANUAL_SETTLEMENT = 'MANUAL_SETTLEMENT'
}

export interface IDamageReport extends Document {
  booking: Types.ObjectId;
  item: Types.ObjectId;
  reportedBy: Types.ObjectId;
  reportedAgainst: Types.ObjectId;
  description: string;
  evidenceImages: string[];
  damageType: DamageType;
  estimatedCost: number;
  status: ReportStatus;
  resolution: ResolutionType;
  resolutionAmount?: number;
  resolutionNote?: string;
  resolvedBy?: Types.ObjectId;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const damageReportSchema = new Schema<IDamageReport>(
  {
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reportedAgainst: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    evidenceImages: { type: [String], default: [] },
    damageType: { type: String, enum: Object.values(DamageType), required: true },
    estimatedCost: { type: Number, required: true, min: 0 },
    status: { type: String, enum: Object.values(ReportStatus), default: ReportStatus.OPEN },
    resolution: { type: String, enum: Object.values(ResolutionType), default: ResolutionType.NONE },
    resolutionAmount: { type: Number, min: 0 },
    resolutionNote: { type: String },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date }
  },
  { timestamps: true }
);

// Only one active damage report per booking/item
damageReportSchema.index({ booking: 1, item: 1 }, { unique: true, partialFilterExpression: { status: { $in: [ReportStatus.OPEN, ReportStatus.UNDER_REVIEW] } } });

// Indexes
damageReportSchema.index({ status: 1 });
damageReportSchema.index({ reportedBy: 1 });
damageReportSchema.index({ reportedAgainst: 1 });

export const DamageReport = mongoose.model<IDamageReport>('DamageReport', damageReportSchema);

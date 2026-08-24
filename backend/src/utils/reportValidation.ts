import { z } from 'zod';
import { DamageType } from '../models/DamageReport';

export const createDamageReportSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  description: z.string().min(1, 'Description is required'),
  damageType: z.enum([DamageType.MINOR, DamageType.MAJOR, DamageType.MISSING_PART, DamageType.LOST, DamageType.OTHER]),
  estimatedCost: z.number().min(0),
  evidenceImages: z.array(z.string()).optional(),
});

export const createDisputeSchema = z.object({
  damageReportId: z.string().min(1, 'Damage Report ID is required'),
  reason: z.string().min(1, 'Reason is required'),
  evidence: z.array(z.string()).optional(),
});

export const resolveDisputeSchema = z.object({
  status: z.enum(['RESOLVED', 'REJECTED']),
  resolution: z.enum(['DEPOSIT_DEDUCTED', 'NO_DEDUCTION', 'MANUAL_SETTLEMENT']),
  resolutionNote: z.string().optional(),
});

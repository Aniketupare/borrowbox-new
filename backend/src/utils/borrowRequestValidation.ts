import { z } from 'zod';

export const createBorrowRequestSchema = z.object({
  item: z.string().min(1, 'Item ID is required'),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  message: z.string().optional(),
}).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
  message: "Start date must be before end date",
  path: ["startDate"],
});

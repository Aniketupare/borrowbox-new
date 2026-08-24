import { z } from 'zod';

export const createBookingSchema = z.object({
  borrowRequestId: z.string().min(1, 'Borrow Request ID is required'),
});

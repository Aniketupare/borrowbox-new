import { z } from 'zod';

export const itemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  condition: z.enum(['New', 'Like New', 'Good', 'Fair']),
  location: z.object({
    coordinates: z.tuple([z.number(), z.number()]),
  }),
  borrowingFee: z.number().min(0),
  securityDeposit: z.number().min(0),
  availability: z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  }),
});

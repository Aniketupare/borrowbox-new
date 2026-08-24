import { Request, Response } from 'express';
import * as reviewService from '../services/reviewService';
import { createReviewSchema } from '../utils/reviewValidation';

export const createReview = async (req: Request, res: Response) => {
  try {
    const validatedData = createReviewSchema.parse(req.body);
    const review = await reviewService.createReview((req as any).user, validatedData);
    res.status(201).json(review);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getReviewsByUser = async (req: Request, res: Response) => {
  try {
    const reviews = await reviewService.getReviewsByUser(req.params.userId);
    res.status(200).json(reviews);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getReviewsByItem = async (req: Request, res: Response) => {
  try {
    const reviews = await reviewService.getReviewsByItem(req.params.itemId);
    res.status(200).json(reviews);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

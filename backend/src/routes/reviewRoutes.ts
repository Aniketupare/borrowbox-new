import { Router } from 'express';
import * as reviewController from '../controllers/reviewController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', protect, reviewController.createReview);
router.get('/user/:userId', reviewController.getReviewsByUser);
router.get('/item/:itemId', reviewController.getReviewsByItem);

export default router;

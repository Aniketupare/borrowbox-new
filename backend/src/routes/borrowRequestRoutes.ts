import { Router } from 'express';
import * as borrowRequestController from '../controllers/borrowRequestController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.route('/')
  .post(borrowRequestController.createBorrowRequest)
  .get(borrowRequestController.getBorrowRequests);

router.put('/:id/approve', borrowRequestController.approveRequest);
router.put('/:id/reject', borrowRequestController.rejectRequest);
router.put('/:id/cancel', borrowRequestController.cancelRequest);

export default router;

import { Router } from 'express';
import * as bookingController from '../controllers/bookingController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.route('/')
  .post(bookingController.createBooking)
  .get(bookingController.getBookings);

router.route('/:id')
  .get(bookingController.getBookingById);

router.put('/:id/return', bookingController.returnBooking);
router.put('/:id/cancel', bookingController.cancelBooking);

export default router;

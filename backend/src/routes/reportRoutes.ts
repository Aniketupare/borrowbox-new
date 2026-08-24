import { Router } from 'express';
import * as reportController from '../controllers/reportController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

// Damage Reports
router.route('/damage-reports')
  .post(reportController.createDamageReport);
router.get('/damage-reports/:id', reportController.getDamageReport);
router.get('/damage-reports/booking/:bookingId', reportController.getDamageReportsByBooking);

// Disputes
router.route('/disputes')
  .post(reportController.createDispute);
router.route('/disputes/:id')
  .get(reportController.getDispute);
router.put('/disputes/:id/resolve', reportController.resolveDispute);

export default router;

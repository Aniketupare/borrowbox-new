import { Router } from 'express';
import * as notificationController from '../controllers/notificationController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', notificationController.getNotifications);
router.put('/:id/read', notificationController.markAsRead);

export default router;

import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/adminMiddleware';
import { User } from '../models/User';
import { Item } from '../models/Item';
import { Booking } from '../models/Booking';

const router = Router();

router.use(protect, isAdmin);

router.get('/stats', async (req, res) => {
    const userCount = await User.countDocuments();
    const itemCount = await Item.countDocuments();
    const bookingCount = await Booking.countDocuments();
    res.json({ userCount, itemCount, bookingCount });
});

router.get('/users', async (req, res) => {
    const users = await User.find().select('-passwordHash');
    res.json(users);
});

export default router;

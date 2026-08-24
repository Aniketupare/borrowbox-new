import { Router } from 'express';
import multer from 'multer';
import * as uploadController from '../controllers/uploadController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only images allowed'));
    }
});

router.post('/', protect, upload.single('image'), uploadController.uploadImage);

export default router;

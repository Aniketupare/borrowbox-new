import { Router } from 'express';
import * as messageController from '../controllers/messageController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.get('/conversations', messageController.getConversations);
router.post('/conversations', messageController.startConversation);
router.get('/:conversationId', messageController.getMessages);
router.post('/:conversationId', messageController.createMessage);

export default router;

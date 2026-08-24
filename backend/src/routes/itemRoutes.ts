import { Router } from 'express';
import * as itemController from '../controllers/itemController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.route('/')
  .post(protect, itemController.createItem)
  .get(itemController.getItems);

router.route('/:id')
  .get(itemController.getItemById)
  .put(protect, itemController.updateItem)
  .delete(protect, itemController.deleteItem);

export default router;

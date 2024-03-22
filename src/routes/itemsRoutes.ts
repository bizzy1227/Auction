import { Router } from 'express';
import ItemController from '../controllers/item.controller';

const router = Router();

router.get('/', ItemController.getList);
router.post('/', ItemController.addItem);

export default router;

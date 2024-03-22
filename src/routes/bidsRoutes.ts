import { Router } from 'express';
import BidController from '../controllers/bid.controller';

const router = Router();

router.post('/', BidController.addBid);

export default router;

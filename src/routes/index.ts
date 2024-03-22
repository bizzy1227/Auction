import { Router } from 'express';
import bidsRoutes from './bidsRoutes';
import itemsRoutes from './itemsRoutes';
import usersRoutes from './usersRoutes';

const router = Router();

router.use('/items', itemsRoutes);
router.use('/bids', bidsRoutes);
router.use('/users', usersRoutes);

export default router;

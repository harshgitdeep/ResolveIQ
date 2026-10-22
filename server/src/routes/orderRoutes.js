import { Router } from 'express';
import { getOrders, getOrderById } from '../controllers/orderController.js';

const router = Router();

router.get('/', getOrders);
router.get('/:orderId', getOrderById);

export default router;

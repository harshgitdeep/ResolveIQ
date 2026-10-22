import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';
import ticketRoutes from './ticketRoutes.js';
import customerRoutes from './customerRoutes.js';
import orderRoutes from './orderRoutes.js';
import agentTraceRoutes from './agentTraceRoutes.js';

const router = Router();

router.get('/health', getHealth);
router.use('/tickets', ticketRoutes);
router.use('/customers', customerRoutes);
router.use('/orders', orderRoutes);
router.use('/traces', agentTraceRoutes);

export default router;

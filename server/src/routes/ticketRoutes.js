import { Router } from 'express';
import { getTickets } from '../controllers/ticketController.js';

const router = Router();

router.get('/', getTickets);

export default router;

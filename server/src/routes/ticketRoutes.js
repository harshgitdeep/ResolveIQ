import { Router } from 'express';
import { getTickets, getTicketById } from '../controllers/ticketController.js';

const router = Router();

router.get('/', getTickets);
router.get('/:ticketId', getTicketById);

export default router;

import { Router } from 'express';
import { getTickets, getTicketById, createTicket, createMessage } from '../controllers/ticketController.js';

const router = Router();

router.get('/', getTickets);
router.post('/', createTicket);
router.get('/:ticketId', getTicketById);
router.post('/:ticketId/messages', createMessage);

export default router;

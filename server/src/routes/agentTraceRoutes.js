import { Router } from 'express';
import { getAgentTraces, getAgentTracesByTicket } from '../controllers/agentTraceController.js';

const router = Router();

router.get('/', getAgentTraces);
router.get('/:ticketId', getAgentTracesByTicket);

export default router;

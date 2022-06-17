import { Router } from 'express'
import messengerService from '../services/messenger'

const router = Router();

router.get('/webhook', (req, res): Promise<void> => messengerService.authorizeWebhook(req, res));
router.post('/webhook', (req, res): Promise<void> => messengerService.handleWebhook(req, res));

export default router;

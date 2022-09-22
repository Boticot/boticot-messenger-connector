import { Request, Response, Router } from 'express'
import { WebhookVerificationRequest } from '../../typings/global'
import messengerService from '../services/messenger'

const router = Router();

router.get('/webhook', (req: WebhookVerificationRequest, res: Response): void =>
  void messengerService.authorizeWebhook(req, res)
);
router.post('/webhook', (req: Request, res: Response): void => 
  void messengerService.handleWebhook(req, res)
);

export default router;

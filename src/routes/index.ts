import { Router } from 'express';
import messenger from './messenger';

const router = Router();
router.use(messenger);

export default router;

import { Router } from 'express';
import contactsRouters from './contacts.js';
import authRouter from './auth.js';
const router = Router();

router.use('/contacts', contactsRouters);
router.use('/auth', authRouter);

export default router;

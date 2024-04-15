import { Router } from 'express';
import homeRouter from './home.routes';

const router = Router();

router.use('/home', homeRouter);

export default router;
import { Router } from 'express';
import mainRouter from './main.routes';

const router = Router();

router.use('/', mainRouter);

export default router;
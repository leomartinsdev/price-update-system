import { Request, Router, Response } from 'express';
import csvToJson from '../utils/csvToJson';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const info = await csvToJson('../../atualizacao_preco_exemplo.csv')
  return res.status(200).json(info);
});

export default router;

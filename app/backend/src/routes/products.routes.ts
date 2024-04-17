import { Request, Router, Response } from 'express';
import ProductController from '../controller/ProductController';

const productController = new ProductController();

const router = Router();

router.post('/', async (req: Request, res: Response) =>
  productController.processProducts(req, res)
); // Endpoint para quando o cliente clickar em "validar".

router.patch('/', async (req: Request, res: Response) =>
  productController.updateProducts(req,res)
); // Endpoint para quando o cliente clickar em "atualizar".

export default router;

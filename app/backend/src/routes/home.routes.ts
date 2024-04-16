import { Request, Router, Response } from 'express';
import ProductController from '../controller/ProductController';

const productController = new ProductController();

const router = Router();

router.post('/', async (req: Request, res: Response) => productController.processProducts(req, res));

export default router;

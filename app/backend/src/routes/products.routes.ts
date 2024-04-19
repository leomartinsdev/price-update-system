import { Request, Router, Response } from 'express';
import ProductController from '../controller/ProductController';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const productController = new ProductController();

const router = Router();

router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  const filePath = req.file?.path;
  productController.processProducts(req, res, filePath? filePath : '');
}); // Endpoint para quando o cliente clickar em "validar".

router.patch('/', async (req: Request, res: Response) =>
  productController.updateProducts(req, res)
); // Endpoint para quando o cliente clickar em "atualizar".

export default router;

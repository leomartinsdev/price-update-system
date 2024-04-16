import { Request, Response } from 'express';
import ProductService from '../services/ProductService';
import csvToJson from '../utils/csvToJson';


export default class ProductController {
    constructor(
        private productService: ProductService = new ProductService(),
    ) {}

    public async processProducts(req: Request, res: Response) {
        // const products = req.body;
        const productsJson = await csvToJson('../../atualizacao_preco_exemplo.csv')
        const serviceResponse = await this.productService.processProducts(productsJson);

        return res.status(200).json(serviceResponse);
    }
}
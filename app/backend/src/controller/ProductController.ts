import { Request, Response } from 'express';
import ProductService from '../services/ProductService';
import { IProductFromCSV } from '../interfaces/Products/IProductFromCSV';
import csvToJson from '../utils/csvToJson';

export default class ProductController {
  constructor(private productService: ProductService = new ProductService()) {}

  public processedData: IProductFromCSV[] = []; // array para salvar os arquivos processados caso seja necessário reutiliza-los.

  public async processProducts(req: Request, res: Response) {
    // const products = req.body;
    this.processedData = []; // Limpa o array de produtos processados.
    const productsJson = await csvToJson('../../atualizacao_preco_exemplo.csv');

    this.processedData = (productsJson); // Salva os produtos processados do CSV no array.
    // passar direto o processedData;
    const serviceResponse = await this.productService.processProducts(
      productsJson
    );

    return res.status(serviceResponse.status).json(serviceResponse.data);
  }

  public async updateProducts(req: Request, res: Response) {
    const products = this.processedData; // Recupera os produtos processados do CSV.
    const serviceResponse = await this.productService.updateProducts(products);

    return res.status(serviceResponse.status).json(serviceResponse.data);
  }
}

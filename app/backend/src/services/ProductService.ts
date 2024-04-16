import ProductModel from '../models/ProductModel';
import { IProductModel } from '../interfaces/Products/IProductModel';
import { IProductFromCSV } from '../interfaces/Products/IProductFromCSV';

export default class ProductService {
  constructor(private productModel: IProductModel = new ProductModel()) {}

  public async processProducts(products: IProductFromCSV[]) {
    const validatedProducts = await this.productModel.validateProducts(
      products
    );
    return { status: 'SUCCESSFUL', data: { validatedProducts } };
  }
}

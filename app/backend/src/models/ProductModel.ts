import SequelizeProducts from '../database/models/SequelizeProducts';
import { IProductModel } from '../interfaces/Products/IProductModel';
import { IProduct } from '../interfaces/Products/IProduct';
import { IProductDTO } from '../interfaces/Products/IProductDTO';
import { IProductFromCSV } from '../interfaces/Products/IProductFromCSV';
import PackModel from './PackModel';
import SequelizePacks from '../database/models/SequelizePacks';

export default class ProductModel implements IProductModel {
  private model = SequelizeProducts;
  private packModel = SequelizePacks

  async findAll(): Promise<IProduct[]> {
    const products = await this.model.findAll();
    return products;
  }

  async findByCode(code: IProduct['code']): Promise<IProduct | null> {
    const product = await this.model.findByPk(code);
    if (product == null) return null;

    return product;
  }

  async update(code: number, newPrice: number): Promise<IProduct | null> {
    const [affectedRows] = await this.model.update(
      { sale_price: newPrice },
      { where: { code } }
    );
    if (affectedRows == 0) return null;

    return this.findByCode(code);
  }

  async validateProducts(products: IProductFromCSV[]): Promise<IProductDTO[]> {
    const validatedProducts: IProductDTO[] = [];
    // const allProducts = await this.findAll();   ->> IMPLEMENTAR ISSO.

    for (const product of products) {
      const validationResult: { isValid: boolean; errors?: string[] } = {
        isValid: true,
        errors: [],
      };

      let productExists: IProduct | null = null;  

      if (!product.product_code) {
        validationResult.isValid = false;
        validationResult.errors?.push('Código do produto não informado.');
      } else if (!product.new_price) {
        productExists = await this.findByCode(product.product_code);
        validationResult.isValid = false;
        validationResult.errors?.push('Novo preço não informado.');
      } else {
        productExists = await this.findByCode(product.product_code);
        if (!productExists) {
          validationResult.isValid = false;
          validationResult.errors?.push('O código do produto não existe.');
        }

        const newPrice = product.new_price;
        if (typeof newPrice !== 'number') {
          validationResult.isValid = false;
          validationResult.errors?.push(
            'Novo preço informado não é um valor número válido.'
          );
        }

        if (productExists && newPrice < Number(productExists.cost_price)) {
          validationResult.isValid = false;
          validationResult.errors?.push(
            'Novo preço é menor que o preço de custo.'
          );
        }

        if (productExists) {
          const diferencaPreco = Math.abs(
            newPrice - Number(productExists.sale_price)
          );
          const diferencaDe10PorCento = productExists.sale_price * 0.1;

          if (diferencaPreco > diferencaDe10PorCento) {
            validationResult.isValid = false;
            validationResult.errors?.push(
              'O novo preço tem mais de 10% de diferença do preço atual.'
            );
          }
        }
      }

      const productDTO: IProductDTO = {
        code: product.product_code ?? '',
        name: productExists ? productExists.name : '',
        current_price: productExists ? Number(productExists.sale_price) : '',
        new_price: product.new_price ?? '',
        validation: validationResult.isValid
          ? 'OK'
          : validationResult.errors?.join(' ') ?? '',
      };

      validatedProducts.push(productDTO);
    }

    return validatedProducts;
  }
}

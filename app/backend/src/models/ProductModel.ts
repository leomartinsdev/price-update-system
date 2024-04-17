import SequelizeProducts from '../database/models/SequelizeProducts';
import SequelizePacks from '../database/models/SequelizePacks';
import { IProductModel } from '../interfaces/Products/IProductModel';
import { IPackModel } from '../interfaces/Packs/IPackModel';
import { IProduct } from '../interfaces/Products/IProduct';
import { IProductDTO } from '../interfaces/Products/IProductDTO';
import { IProductFromCSV } from '../interfaces/Products/IProductFromCSV';
import PackModel from './PackModel';
import { IPack } from '../interfaces/Packs/IPack';

export default class ProductModel implements IProductModel {
  private model = SequelizeProducts;

  constructor(private packModel: IPackModel = new PackModel()) {}

  async findAll(): Promise<IProduct[]> {
    const products = await this.model.findAll();
    return products;
  }

  async findByCode(code: number): Promise<IProduct | null> {
    const product = await this.model.findByPk(code);
    if (product == null) return null;

    return product;
  }

  async calculateCostToUpdate(pack: number) {
    let costToUpdate = 0;
    const packComponents = await this.packModel.getPackComponents(pack);
    for (const component of packComponents) {
      const componentInPack = await this.findByCode(component.code);
      costToUpdate += componentInPack
        ? Number(componentInPack.cost_price) * component.qty
        : 0;
    }

    return costToUpdate;
  }

  async checkIfItsPack(allPacks: IPack[], code: number): Promise<IPack | null> {
    const isPack = allPacks.find((pack) => pack.pack_id === code);
    if (!isPack) return null;
    return isPack;
  }

  async checkIfBelongsToPack(
    allPacks: IPack[],
    code: number
  ): Promise<number | null> {
    const idsInPacks = allPacks.map((pack) => pack.product_id);
    const belongsToPack = idsInPacks.find((id) => id === code);

    if (!belongsToPack) return null;
    return belongsToPack;
  }

  async updateProducts(
    products: IProductFromCSV[]
  ): Promise<IProduct[] | null> {
    const updatedProducts: IProduct[] = [];
    const allPacks = await this.packModel.findAllPacks();

    let updatedRows: number = 0;

    for (const product of products) {
      const [affectedRows] = await this.model.update(
        { sales_price: product.new_price! },
        { where: { code: product.product_code } }
      );

      updatedRows += affectedRows;
      const updatedProduct = product.product_code
        ? await this.findByCode(product.product_code)
        : '';

      updatedProduct ? updatedProducts.push(updatedProduct!) : null;

      const isPack = await this.checkIfItsPack(allPacks, product.product_code!);

      if (isPack) {
        const costToUpdate = await this.calculateCostToUpdate(isPack.pack_id);
        await this.model.update(
          { cost_price: costToUpdate },
          { where: { code: product.product_code } }
        );

        console.log('updated');
      }
    }

    if (updatedRows === 0) return null;

    return updatedProducts;
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
            newPrice - Number(productExists.sales_price)
          );
          const diferencaDe10PorCento = productExists.sales_price * 0.1;

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
        current_price: productExists ? Number(productExists.sales_price) : '',
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

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
    console.log('------- ENTROU NO CHECK IF BELONGS TO PACKS ----------');

    let belongsToThisPack = allPacks.find((pack) => {
      if (pack.product_id === code) {
        return pack.pack_id;
      }
    });

    if (!belongsToThisPack) return null;
    console.log(
      '------- BELONGSTOPACK: ---------- ',
      belongsToThisPack.pack_id
    );

    return belongsToThisPack.pack_id;
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

  async expectedNewPackPrice(
    products: IProductFromCSV[],
    packComponents: { code: number; qty: number }[]
  ): Promise<number> {
    console.log('------- ENTROU NO EXPECTED NEW PACK PRICE ----------');
    const allProducts = await this.findAll();
    const allProductsInThePack = [];
    let expectedFinalPrice = 0;

    for (const component of packComponents) {
      const product = allProducts.find((e) => e.code === component.code);
      if (product) {
        allProductsInThePack.push(product);
      }
    }
    console.log('------- all prods IN PACK ----------: ', allProductsInThePack);

    const packComponentsToBeUpdated = products.filter((product) =>
      packComponents.some((e) => e.code === product.product_code)
    );

    allProductsInThePack.forEach((productInPack) =>
      packComponentsToBeUpdated.forEach((productToBeUpdated) => {
        if (Number(productInPack.code) === productToBeUpdated.product_code) {
          productInPack.sales_price = Number(productToBeUpdated.new_price);
        }
      })
    );

    allProductsInThePack.forEach((productInPack) => {
      const component = packComponents.find(
        (e) => e.code === Number(productInPack.code)
      );
      if (component) {
        expectedFinalPrice += productInPack.sales_price * component.qty;
      }
    });
    
    return expectedFinalPrice;
  }

  async validateProducts(products: IProductFromCSV[]): Promise<IProductDTO[]> {
    const validatedProducts: IProductDTO[] = [];
    const allPacks = await this.packModel.findAllPacks();

    console.log('------- ENTROU NO VALIDATE PRODUCTS ----------');

    // const allProducts = await this.findAll();   ->> IMPLEMENTAR ISSO.

    for (const product of products) {
      console.log(
        '------- ENTROU NO FOR DO VALIDATE PRODUCTS: PRODUTO: ----------: ',
        product.product_code
      );
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
        console.log('------- ENTROU NO ELSE DE QUE TEM OS CAMPOS ----------');
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

        const productPackId = await this.checkIfBelongsToPack(
          allPacks,
          product.product_code!
        ); // Retorna o ID da pack do qual o produto faz parte.

        const isPack = await this.checkIfItsPack(
          allPacks,
          product.product_code!
        );

        if (isPack) {
          console.log('------- ENTROU NO CASO DE SER PACK ----------');
          const packComponents = await this.packModel.getPackComponents(
            product.product_code!
          ); // é um array com prodId e qty.
          let componentsInProducts: IProductFromCSV[] = [];

          console.log(
            '------- PACK COMPONENTS DO CASO DE SER PACK ----------: ',
            packComponents
          ); // isso está preenchido
          // Verificar se algum dos prodIds estão em products.
          for (const component of packComponents) {
            console.log(
              '------- COMPONENT OLHAR AQUI 1 ----------: ',
              component
            );
            console.log(
              '------- COMPONENT OLHAR AQUI 2 ----------: ',
              products
            );
            const foundComponent = products.find(
              (e) => e.product_code === component.code
            );
            if (foundComponent) {
              componentsInProducts.push(foundComponent);
            }
            console.log(
              '------- COMPONENT OLHAR AQUI 3 ----------: ',
              componentsInProducts
            );
          }

          console.log(
            '------- COMPONENTS IN PRODUCTS ----------: ',
            componentsInProducts
          ); // isso está chegando vazio

          if (componentsInProducts.length === 0) {
            console.log(
              '------- ENTROU NO CASO DE SER PACK E NAO ATUALIZAR UM DOS COMPS ----------'
            );
            validationResult.isValid = false;
            validationResult.errors?.push(
              'É proibido atualizar uma pack sem atualizar pelo menos um de seus componentes.'
            );
          } else {
            console.log(
              '------- ENTROU NO CASO DE SER PACK E O PREÇO ESPERADO NAO BATER ----------'
            );
            const expectedNewPackPrice = await this.expectedNewPackPrice(
              products,
              packComponents
            );

            if (expectedNewPackPrice != product.new_price) {
              validationResult.isValid = false;
              validationResult.errors?.push(
                'O preço da pack não corresponde ao esperado dado o novo preço de seus componentes.'
              );
            }
          }
        } else if (productPackId) {
          console.log('------- ENTROU NO CASO DE ESTAR EM UMA PACK ----------');
          const packExistsInProducts = products.filter(
            (e) => e.product_code === productPackId
          ); // Verifica se a pack também está no arquivo de atualização.
          console.log(
            '------- PackExistsInProducts ----------: ',
            packExistsInProducts
          );

          if (packExistsInProducts.length === 0) {
            validationResult.isValid = false;
            validationResult.errors?.push(
              'É proibido atualizar um componente de uma pack sem atualizar a pack.'
            );
          } else {
            const packComponents = await this.packModel.getPackComponents(
              productPackId
            ); // Busco os componentes da pack do qual o produto faz parte.
            const expectedNewPackPrice = await this.expectedNewPackPrice(
              products,
              packComponents
            );

            if (expectedNewPackPrice != packExistsInProducts[0].new_price) {
              console.log(
                '------- ENTROU NO CASO DE NAO SER PACK E O PREÇO ESTAR ERRADO ----------: '
              );
              validationResult.isValid = false;
              validationResult.errors?.push(
                'O preço da pack não corresponde ao esperado dado o novo preço de seus componentes.'
              );
            }
          }
        }
      }

      // ----------------------------
      // Primeiro, vamos verificar se é uma pack.

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

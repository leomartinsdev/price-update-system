import SequelizePacks from '../database/models/SequelizePacks';
import SequelizeProducts from '../database/models/SequelizeProducts';
import { IPackModel } from '../interfaces/Packs/IPackModel';
import { IPack } from '../interfaces/Packs/IPack';
import { IProduct } from '../interfaces/Products/IProduct';

export default class PackModel implements IPackModel {
  private model = SequelizePacks;
  private productModel = SequelizeProducts;

  async findAllPacks(): Promise<IPack[]> {
    const products = await this.model.findAll();
    return products;
  }

  async findByPackId(packId: IPack['pack_id']): Promise<IPack[] | null> {
    const pack = await this.model.findAll({ where: { pack_id: packId } });
    if (pack == null) return null;

    return pack;
  }

  async getPackComponents(packId: number): Promise<any | null> {
    const packComponents = await this.model.findAll({
      where: {
        pack_id: packId,
      },
    });

    return Promise.all(
      packComponents.map(async (component: any) => {
        const product = await this.productModel.findByPk(component.product_id);
        if (product) {
          return {
            product_code: product.code,
            product_name: product.name,
            quantity: component.qty,
          };
        }
        return null;
      })
    );
  }
}

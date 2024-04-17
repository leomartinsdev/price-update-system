import SequelizePacks from '../database/models/SequelizePacks';
import { IPackModel } from '../interfaces/Packs/IPackModel';
import { IPack } from '../interfaces/Packs/IPack';

export default class PackModel implements IPackModel {
  private model = SequelizePacks;

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
    const packs = await this.model.findAll({
      where: { pack_id: packId },
    });

    if (packs == null) return null;

    const packComponents = packs.map((pack) => ({ code: pack.product_id, qty: pack.qty }));

    // Retornar os produtos componentes do pack, ou seja os product_code e a quantidade de cada produto no pack.
    return packComponents;
  }
}

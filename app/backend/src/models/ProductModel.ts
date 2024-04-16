import SequelizeProducts from '../database/models/SequelizeProducts';
import { IProductModel } from '../interfaces/Products/IProductModel';
import { IProduct } from '../interfaces/Products/IProduct';
import { IProductFromCSV } from '../interfaces/Products/IProductFromCSV';

export default class ProductModel implements IProductModel {
    private model = SequelizeProducts;

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
        const [affectedRows] = await this.model.update({ sale_price: newPrice }, { where: { code } });
        if (affectedRows == 0) return null;
        return this.findByCode(code);
    }

    async validateProducts(products: IProductFromCSV[]): Promise<IProduct[] | null> {
        const validatedProducts = [];
        // Valiadações
        return null;
    }
}
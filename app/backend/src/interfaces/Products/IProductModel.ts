import { IProduct } from "./IProduct";
import { IProductDTO } from "./IProductDTO";
import { IProductFromCSV } from "./IProductFromCSV";

export interface IProductModel {
    findAll(): Promise<IProduct[]>
    findByCode(code: number): Promise<IProduct | null>
    update(code: number, newPrice: number): Promise<IProduct | null>
    validateProducts(products: IProductFromCSV[]): Promise<IProductDTO[]>
}
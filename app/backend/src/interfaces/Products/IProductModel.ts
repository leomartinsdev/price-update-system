import { IProduct } from "./IProduct";
import { IProductDTO } from "./IProductDTO";
import { IProductFromCSV } from "./IProductFromCSV";

export interface IProductModel {
    findAll(): Promise<IProduct[]>
    findByCode(code: number): Promise<IProduct | null>
    updateProducts(products: IProductFromCSV[]): Promise<IProduct[] | null>
    validateProducts(products: IProductFromCSV[]): Promise<IProductDTO[]>
}
import { IPack } from "./IPack";

export interface IPackModel {
    findAllPacks(): Promise<IPack[]>
    findByPackId(packId: number): Promise<IPack[] | null>
    getPackComponents(packId: number): Promise<any | null>
}
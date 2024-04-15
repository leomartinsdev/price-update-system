import { Request, Router, Response } from 'express';
import csvtojsonV2 from "csvtojson";

const router = Router();

function csvToJson(): any | void {
    const csvFilePath = '../../atualizacao_preco_exemplo.csv';
    const data = csvtojsonV2().fromFile(csvFilePath).then((jsonObj) => jsonObj);
    return data;
}

router.post('/', csvToJson(), (req: Request, res: Response) => {});

export default router;
import { Request, Router, Response } from 'express';
import csvtojsonV2 from 'csvtojson';

const router = Router();

function csvToJson(): any | void {
  const csvFilePath = '../../atualizacao_preco_exemplo.csv';
  const data = csvtojsonV2({ checkType: true })
    .fromFile(csvFilePath)
    .then((jsonObj) => jsonObj);
  return data;
}



// IDEIA -> qdo for comparar com o banco, baixa tudo do banco de uma vez e comparada com o que baixar. Não baixa toda vez.


router.post('/', csvToJson(), (req: Request, res: Response) => {});

export default router;

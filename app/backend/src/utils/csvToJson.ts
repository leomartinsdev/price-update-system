import csvtojsonV2 from 'csvtojson';

export default function csvToJson(csvPath: string): any | void{
    const csvFilePath = csvPath;
    const data = csvtojsonV2({ checkType: true })
      .fromFile(csvFilePath)
      .then((jsonObj) => jsonObj);
    return data;
}
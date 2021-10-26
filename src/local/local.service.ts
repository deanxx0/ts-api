import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class LocalService {
  constructor() {}

  async getDataset(): Promise<any> {
    console.log(`[local service] getDataset`);
    const datasetList: string[] = fs.readdirSync(process.env.DATASETS_DIR);
    return datasetList;
  }

  async getPretrain(): Promise<any> {
    console.log(`[local service] getPretrain`);
    const pretrainList: string[] = fs.readdirSync(process.env.PRETRAINED_DIR);
    return pretrainList;
  }
}

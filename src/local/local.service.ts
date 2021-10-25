import { Injectable } from '@nestjs/common';
import fs from 'fs';

@Injectable()
export class LocalService {
  constructor() {}

  async getDataset(): Promise<any> {
    console.log(`[local service] getDataset`);
    fs.readdir('./',{withFileTypes: true} ,(err, files) => {
      files.forEach(file => {
        console.log(file.name);
      })
    });
    
  }
}

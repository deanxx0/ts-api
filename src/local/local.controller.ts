import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalService } from './local.service';

@Controller('local')
export class LocalController {
  constructor(private localService: LocalService) {}

  @UseGuards(JwtAuthGuard)
  @Get('dataset')
  async getDataset(): Promise<any> {
    console.log(`[Req][local controller] getDataset`);
    const datasetList = await this.localService.getDataset();
    return {
      success: datasetList != null ? true : false,
      result: datasetList,
    }
  }
}

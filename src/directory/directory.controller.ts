import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TrainService } from 'src/train/train.service';
import { DirectoryService } from './directory.service';

@Controller('directory')
export class DirectoryController {
  constructor(private directoryService: DirectoryService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':train_id')
  async getDirectoryByTrain_id(@Param('train_id') train_id: string): Promise<any> {
    console.log(`[Req][directory controller] getDirectoryByTrain_id`);
    const directory = await this.directoryService.getDirectoryByTrain_id(train_id);
    return {
      success: directory != null ? true : false,
      result: directory,
    }
  }
}

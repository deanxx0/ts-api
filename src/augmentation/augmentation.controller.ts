import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AugmentationService } from './augmentation.service';

@Controller('augmentation')
export class AugmentationController {
  constructor(private augmentationService: AugmentationService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':train_id')
  async getAugmentationByTrain_id(@Param('train_id') train_id: string): Promise<any> {
    console.log(`[Req][augmentation controller] getAugmentationByTrain_id`);
    const augmentation = await this.augmentationService.getAugmentationByTrain_id(train_id);
    return {
      success: augmentation != null ? true : false,
      result: augmentation,
    }
  }
}

import { Module } from '@nestjs/common';
import { AugmentationController } from './augmentation.controller';
import { AugmentationService } from './augmentation.service';

@Module({
  controllers: [AugmentationController],
  providers: [AugmentationService]
})
export class AugmentationModule {}

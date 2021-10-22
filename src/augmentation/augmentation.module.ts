import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AugmentationController } from './augmentation.controller';
import { Augmentation, AugmentationSchema } from './augmentation.schema';
import { AugmentationService } from './augmentation.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Augmentation.name, schema: AugmentationSchema }]),
  ],
  controllers: [AugmentationController],
  providers: [AugmentationService],
  exports: [AugmentationService],
})
export class AugmentationModule {}

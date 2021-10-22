import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AugmentationModule } from 'src/augmentation/augmentation.module';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { DirectoryModule } from 'src/directory/directory.module';
import { TrainServerModule } from 'src/train-server/train-server.module';
import { TrainController } from './train.controller';
import { Train, TrainSchema } from './train.schema';
import { TrainService } from './train.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Train.name, schema: TrainSchema }]),
    forwardRef(() => DirectoryModule),
    forwardRef(() => ConfigurationModule),
    forwardRef(() => AugmentationModule),
    forwardRef(() => TrainServerModule),
  ],
  controllers: [TrainController],
  providers: [TrainService],
  exports: [TrainService],
})
export class TrainModule {}

import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrainModule } from 'src/train/train.module';
import { ConfigurationController } from './configuration.controller';
import { Configuration, ConfigurationSchema } from './configuration.schema';
import { ConfigurationService } from './configuration.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Configuration.name, schema: ConfigurationSchema }]),
    forwardRef(() => TrainModule),
  ],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigurationController } from './configuration.controller';
import { Configuration, ConfigurationSchema } from './configuration.schema';
import { ConfigurationService } from './configuration.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Configuration.name, schema: ConfigurationSchema }]),
  ],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}

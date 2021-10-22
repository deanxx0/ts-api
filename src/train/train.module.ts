import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { DirectoryModule } from 'src/directory/directory.module';
import { TrainController } from './train.controller';
import { TrainService } from './train.service';

@Module({
  imports: [
    DirectoryModule,
    ConfigurationModule,
  ],
  controllers: [TrainController],
  providers: [TrainService],
})
export class TrainModule {}

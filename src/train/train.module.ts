import { Module } from '@nestjs/common';
import { TrainController } from './train.controller';
import { TrainService } from './train.service';

@Module({
  controllers: [TrainController],
  providers: [TrainService]
})
export class TrainModule {}

import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { ServerInfoModule } from 'src/server-info/server-info.module';
import { TrainModule } from 'src/train/train.module';
import { UserModule } from 'src/user/user.module';
import { TrainServerService } from './train-server.service';
import { TrainServerController } from './train-server.controller';

@Module({
  imports: [
    HttpModule,
    UserModule,
    ServerInfoModule,
    forwardRef(() => TrainModule),
  ],
  providers: [TrainServerService],
  exports: [TrainServerService],
  controllers: [TrainServerController],
})
export class TrainServerModule {}

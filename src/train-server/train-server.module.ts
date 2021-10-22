import { HttpModule, Module } from '@nestjs/common';
import { ServerInfoModule } from 'src/server-info/server-info.module';
import { UserModule } from 'src/user/user.module';
import { TrainServerService } from './train-server.service';

@Module({
  imports: [
    HttpModule,
    UserModule,
    ServerInfoModule,
  ],
  providers: [TrainServerService],
  exports: [TrainServerService],
})
export class TrainServerModule {}

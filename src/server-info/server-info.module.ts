import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServerInfoController } from './server-info.controller';
import { ServerInfo, ServerInfoSchema } from './server-info.schema';
import { ServerInfoService } from './server-info.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ServerInfo.name, schema: ServerInfoSchema }]),
  ],
  controllers: [ServerInfoController],
  providers: [ServerInfoService],
  exports: [ServerInfoService],
})
export class ServerInfoModule {}

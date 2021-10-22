import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateServerInfoDto } from './create-server-info.dto';
import { PostServerInfoDto } from './post-server-info.dto';
import { ServerInfo, ServerInfoDocument } from './server-info.schema';
import ObjectID from 'bson-objectid';

@Injectable()
export class ServerInfoService {
  constructor(
    @InjectModel(ServerInfo.name) private serverInfoModel: Model<ServerInfoDocument>,
  ) {}

  async createServerInfo(postServerInfoDto: PostServerInfoDto): Promise<ServerInfoDocument> {
    console.log(`[server info service] createServerInfo`);
    const createServerInfoDto = this.buildCreateServerInfoDto(postServerInfoDto);
    const serverInfoDoc = new this.serverInfoModel(createServerInfoDto);
    return serverInfoDoc.save();
  }

  async findByServerIndex(serverIndex: number): Promise<ServerInfoDocument> {
    console.log(`[server info service] findByServerIndex`);
    return this.serverInfoModel.findOne({ serverIndex: serverIndex }).exec();
  }

  buildCreateServerInfoDto(postServerInfoDto: PostServerInfoDto): CreateServerInfoDto {
    return {
      _id: (new ObjectID()).toHexString(),
      serverIndex: postServerInfoDto.serverIndex,
      uri: postServerInfoDto.uri,
    }
  }
}

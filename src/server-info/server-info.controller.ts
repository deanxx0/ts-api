import { Body, Controller, Post } from '@nestjs/common';
import { PostServerInfoDto } from './post-server-info.dto';
import { ServerInfoService } from './server-info.service';

@Controller('server-info')
export class ServerInfoController {
  constructor(private serverInfoService: ServerInfoService) {}

  @Post()
  async createServerInfo(@Body() postServerInfoDto: PostServerInfoDto): Promise<any> {
    console.log(`[Req][server info controller] createServerInfo`);
    const serverInfoDoc = await this.serverInfoService.createServerInfo(postServerInfoDto);
    return {
      success: serverInfoDoc != null ? true : false,
      result: serverInfoDoc,
    }
  }
}

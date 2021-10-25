import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TrainServerService } from './train-server.service';

@Controller('train-server')
export class TrainServerController {
  constructor(private trainServerService: TrainServerService) {}

  @UseGuards(JwtAuthGuard)
  @Get('resource')
  async getResource(@Request() req): Promise<any> {
    console.log(`[train server controller] getResource`);
    const resource = await this.trainServerService.getResource(req.user.username);
    return {
      success: resource != null ? true : false,
      result: resource,
    }
  }
}

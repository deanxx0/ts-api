import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ConfigurationService } from './configuration.service';

@Controller('configuration')
export class ConfigurationController {
  constructor(
    private configurationService: ConfigurationService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':train_id')
  async getConfigurationByTrain_id(@Param('train_id') train_id: string): Promise<any> {
    console.log(`[configuration controller] getConfigurationByTrain_id`);
    const configuration = await this.configurationService.getConfigurationByTrain_id(train_id);
    return {
      success: configuration != null ? true : false,
      result: configuration,
    }
  }
}

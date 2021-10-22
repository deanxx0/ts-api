import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostTrainDto } from 'src/train/post-train.dto';
import { Configuration, ConfigurationDocument } from './configuration.schema';
import { CreateConfigurationDto } from './create-configuration.dto';
import ObjectID from 'bson-objectid';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectModel(Configuration.name) private configurationModel: Model<ConfigurationDocument>,
  ) {}

  async createConfiguration(postTrainDto: PostTrainDto): Promise<ConfigurationDocument> {
    console.log(`[configuration service] createConfiguration`);
    const createConfigurationDto = this.buildCreateConfigurationDto(postTrainDto);
    const configurationDoc = new this.configurationModel(createConfigurationDto);
    return configurationDoc.save();
  }

  buildCreateConfigurationDto(postTrainDto: PostTrainDto): CreateConfigurationDto {
    return {
      _id: (new ObjectID()).toHexString(),
      batchSize: postTrainDto.configuration.batchSize,
      pretrainData: postTrainDto.configuration.pretrainData,
      width: postTrainDto.configuration.width,
      height: postTrainDto.configuration.height,
      channels: postTrainDto.configuration.channels,
      baseLearningRate: postTrainDto.configuration.baseLearningRate,
      gamma: postTrainDto.configuration.gamma,
      stepCount: postTrainDto.configuration.stepCount,
      maxIteration: postTrainDto.configuration.maxIteration,
    }
  }
}

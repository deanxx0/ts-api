import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostTrainDto } from 'src/train/post-train.dto';
import { Configuration, ConfigurationDocument } from './configuration.schema';
import { CreateConfigurationDto } from './create-configuration.dto';
import ObjectID from 'bson-objectid';
import { TrainService } from 'src/train/train.service';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectModel(Configuration.name) private configurationModel: Model<ConfigurationDocument>,
    @Inject(forwardRef(() => TrainService))
    private trainService: TrainService,
  ) {}

  async createConfiguration(postTrainDto: PostTrainDto): Promise<ConfigurationDocument> {
    console.log(`[configuration service] createConfiguration`);
    const createConfigurationDto = this.buildCreateConfigurationDto(postTrainDto);
    const configurationDoc = new this.configurationModel(createConfigurationDto);
    return configurationDoc.save();
  }

  async deleteConfigurationBy_id(_id: string): Promise<ConfigurationDocument> {
    console.log(`[configuration service] deleteConfigurationBy_id`);
    return this.configurationModel.findByIdAndDelete(_id).exec();
  }

  async getConfigurationByTrain_id(train_id: string): Promise<ConfigurationDocument> {
    console.log(`[configuration service] getConfigurationByTrain_id`);
    const train = await this.trainService.findTrainBy_id(train_id);
    const configuration = await this.findOneById(train.configurationId);
    return configuration;
  }

  async findOneById(_id: string): Promise<ConfigurationDocument> {
    console.log(`[configuration service] findOneById`);
    return this.configurationModel.findOne({ _id: _id }).exec();
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

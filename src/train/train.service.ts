import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { DirectoryService } from 'src/directory/directory.service';
import { PostTrainDto } from './post-train.dto';
import { Train, TrainDocument } from './train.schema';

@Injectable()
export class TrainService {
  constructor(
    @InjectModel(Train.name) private trainModel: Model<TrainDocument>,
    private directoryService: DirectoryService,
    private configurationService: ConfigurationService,
  ) {}

  async createTrain(
    username: string,
    postTrainDto: PostTrainDto,
  ): Promise<any> {
    const directoryDoc = await this.directoryService.createDirectory(postTrainDto);
    const configurationDoc = await this.configurationService.createConfiguration(postTrainDto);
    
    return {
      success: true,
      result: directoryDoc,
    }
  }
}

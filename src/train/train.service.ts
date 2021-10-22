import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import ObjectID from 'bson-objectid';
import { Model } from 'mongoose';
import { AugmentationService } from 'src/augmentation/augmentation.service';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { DirectoryService } from 'src/directory/directory.service';
import { TrainServerService } from 'src/train-server/train-server.service';
import { UserService } from 'src/user/user.service';
import { CreateTrainDto } from './create-train.dto';
import { PostTrainDto } from './post-train.dto';
import { Train, TrainDocument } from './train.schema';

@Injectable()
export class TrainService {
  constructor(
    @InjectModel(Train.name) private trainModel: Model<TrainDocument>,
    private directoryService: DirectoryService,
    private configurationService: ConfigurationService,
    private augmentationService: AugmentationService,
    private trainServerService: TrainServerService,
  ) {}

  async createTrain(
    username: string,
    postTrainDto: PostTrainDto,
  ): Promise<any> {
    const directoryDoc = await this.directoryService.createDirectory(postTrainDto);
    const configurationDoc = await this.configurationService.createConfiguration(postTrainDto);
    const augmentationDoc = await this.augmentationService.createAugmentation(postTrainDto);
    const serverTrainId = await this.trainServerService.postTrain(username, postTrainDto);
    const CreateTrainDto = this.buildCreateTrainDto(
      directoryDoc._id,
      configurationDoc._id,
      augmentationDoc._id,
      serverTrainId,
      postTrainDto.name,
    );
    const trainDoc = new this.trainModel(CreateTrainDto);
    return trainDoc.save();
  }

  buildCreateTrainDto(
    directory_id: string,
    configuration_id: string,
    augmentation_id: string,
    serverTrainId: string,
    postTrainDtoName: string,
  ): CreateTrainDto {
    return {
      _id: (new ObjectID()).toHexString(),
      name: postTrainDtoName,
      serverTrainId: serverTrainId,
      directoryId: directory_id,
      configurationId: configuration_id,
      augmentationId: augmentation_id,
    }
  }
}

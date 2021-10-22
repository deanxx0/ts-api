import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import ObjectID from 'bson-objectid';
import { Model } from 'mongoose';
import { AugmentationService } from 'src/augmentation/augmentation.service';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { DirectoryService } from 'src/directory/directory.service';
import { TrainServerService } from 'src/train-server/train-server.service';
import { CreateTrainDto } from './create-train.dto';
import { PostTrainDto } from './post-train.dto';
import { ResTrainInfoDto } from './res-train-info.dto';
import { Train, TrainDocument } from './train.schema';

@Injectable()
export class TrainService {
  constructor(
    @InjectModel(Train.name) private trainModel: Model<TrainDocument>,
    @Inject(forwardRef(() => DirectoryService))
    private directoryService: DirectoryService,
    @Inject(forwardRef(() => ConfigurationService))
    private configurationService: ConfigurationService,
    @Inject(forwardRef(() => AugmentationService))
    private augmentationService: AugmentationService,
    @Inject(forwardRef(() => TrainServerService))
    private trainServerService: TrainServerService,
  ) {}

  async createTrain(
    username: string,
    postTrainDto: PostTrainDto,
  ): Promise<any> {
    console.log(`[train service] createTrain`);
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

  async getTrainInfoBy_id(username: string, _id: string): Promise<any> {
    console.log(`[train service] getTrainInfoBy_id`);
    const trainDoc = await this.findTrainBy_id(_id);
    const trainStatus = await this.trainServerService.getTrainStatus(username, _id);
    const trainMetric = await this.trainServerService.getTrainMetric(username, _id);
    const resTrainInfoDto = this.buildResTrainInfoDto(trainDoc, trainStatus, trainMetric);
    return resTrainInfoDto;
  }

  async findTrainBy_id(_id: string): Promise<any> {
    console.log(`[train service] findTrainBy_id`);
    return this.trainModel.findById(_id).exec();
  }

  async getTrainPage(pageNo: number): Promise<any[]> {
    console.log(`[train service] getTrainPages`);
    const perPage = 15;
    return this.trainModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(perPage)
      .skip(perPage * (pageNo-1))
      .select({ _id: 1})
      .exec();
  }

  async deleteTrainInfoBy_id(username: string, _id: string) {
    console.log(`[train service] deleteTrainInfoBy_id`);
    const trainStatus = await this.trainServerService.getTrainStatus(username, _id);
    if (trainStatus != 'done' && trainStatus != 'error') {
      console.log(`Training is on processing : only 'done' or 'error' train status could be deleted`);
      return null;
    }
    const train = await this.findTrainBy_id(_id);
    const deletedDirectory = await this.directoryService.deleteDirectoryBy_id(train.directoryId);
    const deletedConfiguration = await this.configurationService.deleteConfigurationBy_id(train.configurationId);
    const deletedAugmentation = await this.augmentationService.deleteAugmentationBy_id(train.augmentationId);
    const deletedTrain = await this.deleteTrainBy_id(_id);
    if (
      deletedDirectory == null ||
      deletedConfiguration == null ||
      deletedAugmentation == null ||
      deletedTrain == null
    ) {
      return null;
    }
    return deletedTrain;
  }

  async deleteTrainBy_id(_id: string): Promise<TrainDocument> {
    console.log(`[train service] deleteTrainBy_id`);
    return this.trainModel.findByIdAndDelete(_id).exec();
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

  buildResTrainInfoDto(
    trainDoc,
    trainStatus,
    trainMetric,
  ): ResTrainInfoDto {
    return {
      id: trainDoc._id,
      name: trainDoc.name,
      status: trainStatus,
      progress: trainMetric.iteration / trainMetric.max_iteration,
      createdAt: trainDoc.createdAt,
      train_loss: trainMetric.train_loss,
      test_loss: trainMetric.test_loss,
      test_accuracy: trainMetric.test_accuracy,
      iou: trainMetric.test_accuracy2,
      iteration: trainMetric.iteration,
      max_iteration: trainMetric.max_iteration,
      directoryId: trainDoc.directoyId,
      configurationId: trainDoc.configurationId,
      augmentationId: trainDoc.augmentationId,
    }
  }
}

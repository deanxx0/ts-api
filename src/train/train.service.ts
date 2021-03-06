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
import { ResTrainSettingDto } from './res-train-setting.dto';
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
    postTrainDto: PostTrainDto,
  ): Promise<any> {
    console.log(`[train service] createTrain`);
    const directoryDoc = await this.directoryService.createDirectory(postTrainDto);
    const configurationDoc = await this.configurationService.createConfiguration(postTrainDto);
    const augmentationDoc = await this.augmentationService.createAugmentation(postTrainDto);
    const serverTrainId = await this.trainServerService.postTrain(postTrainDto);
    const CreateTrainDto = this.buildCreateTrainDto(
      directoryDoc._id,
      configurationDoc._id,
      augmentationDoc._id,
      serverTrainId,
      postTrainDto,
    );
    const trainDoc = new this.trainModel(CreateTrainDto);
    return trainDoc.save();
  }

  async findAllTrain(): Promise<any> {
    console.log(`[train service] findAllTrain`);
    // return this.trainModel.find({}).select({ _id: 1}).exec();
    const trainDocList = await this.trainModel.find({}).exec();
    const trainResList = await Promise.all(
      trainDocList.map(trainDoc => {
        return this.getTrainInfoBy_id(trainDoc._id);
      })
    )
    return trainResList;
  }

  async getTrainInfoBy_id(_id: string): Promise<any> {
    console.log(`[train service] getTrainInfoBy_id`);
    const trainDoc = await this.findTrainBy_id(_id);
    const trainStatus = await this.trainServerService.getTrainStatus(_id);
    const trainMetric = await this.trainServerService.getTrainMetric(_id);
    const resTrainInfoDto = this.buildResTrainInfoDto(trainDoc, trainStatus, trainMetric);
    return resTrainInfoDto;
  }

  async findTrainBy_id(_id: string): Promise<any> {
    console.log(`[train service] findTrainBy_id`);
    return this.trainModel.findById(_id).exec();
  }

  async getTrainPage(pageNo: number, perPage: string): Promise<any[]> {
    console.log(`[train service] getTrainPages`);
    const intPerPage = parseInt(perPage)
    const trainDocList = await this.trainModel.find({}).sort({ createdAt: -1 }).limit(intPerPage).skip(intPerPage * (pageNo-1)).exec();
    const trainResList = await Promise.all(
      trainDocList.map(trainDoc => {
        return this.getTrainInfoBy_id(trainDoc._id);
      })
    );
    return trainResList;
    // return this.trainModel
    //   .find({})
    //   .sort({ createdAt: -1 })
    //   .limit(perPage)
    //   .skip(perPage * (pageNo-1))
    //   .select({ _id: 1})
    //   .exec();
  }

  async getTotalPage(): Promise<any> {
    console.log(`[train service] getTotalPage`);
    const perPage = 5;
    const totalDocCount = await this.trainModel.countDocuments();
    return Math.ceil(totalDocCount / perPage);
  }

  async getTotalCount(): Promise<any> {
    console.log(`[train service] getTotalCount`);
    const totalDocCount = await this.trainModel.countDocuments();
    return totalDocCount;
  }

  async getTrainSetting(train_id: string): Promise<any> {
    console.log(`[train service] getTrainSetting`);
    const train = await this.findTrainBy_id(train_id);
    const configuration = await this.configurationService.findOneById(train.configurationId);
    const augmentataion = await this.augmentationService.findOneById(train.augmentationId);
    const resTrainSetting = this.buildResTrainSettingDto(train, configuration, augmentataion);
    return resTrainSetting;
  }

  async deleteTrainInfoBy_id(_id: string) {
    console.log(`[train service] deleteTrainInfoBy_id`);
    const trainStatus = await this.trainServerService.getTrainStatus(_id);
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

  buildResTrainSettingDto(train, configuration, augmentation): ResTrainSettingDto {
    return {
      name: train.name,
      serverIndex: train.serverIndex,
      batchSize: configuration.batchSize,
      pretrainData: configuration.pretrainData,
      width: configuration.width,
      height: configuration.height,
      channels: configuration.channels,
      baseLearningRate: configuration.baseLearningRate,
      gamma: configuration.gamma,
      stepCount: configuration.stepCount,
      maxIteration: configuration.maxIteration,
      mirror: augmentation.mirror,
      flip: augmentation.flip,
      rotation90: augmentation.rotation90,
      zoom: augmentation.zoom,
      tilt: augmentation.tilt,
      shift: augmentation.shift,
      rotation: augmentation.rotation,
      contrast: augmentation.contrast,
      brightness: augmentation.brightness,
      smoothFiltering: augmentation.smoothFiltering,
      noise: augmentation.noise,
      colorNoise: augmentation.colorNoise,
      partialFocus: augmentation.partialFocus,
      shade: augmentation.shade,
      hue: augmentation.hue,
      saturation: augmentation.saturation,
      maxRandomAugmentCount: augmentation.maxRandomAugmentCount,
      probability: augmentation.probability,
      borderMode: augmentation.borderMode,
    }
  }

  buildCreateTrainDto(
    directory_id: string,
    configuration_id: string,
    augmentation_id: string,
    serverTrainId: string,
    postTrainDto: PostTrainDto,
  ): CreateTrainDto {
    return {
      _id: (new ObjectID()).toHexString(),
      serverIndex: postTrainDto.serverIndex,
      name: postTrainDto.name,
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
      serverIndex: trainDoc.serverIndex,
      serverTrainId: trainDoc.serverTrainId,
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

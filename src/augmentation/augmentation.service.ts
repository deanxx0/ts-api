import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostTrainDto } from 'src/train/post-train.dto';
import { Augmentation, AugmentationDocument } from './augmentation.schema';
import { CreateAugmentationDto } from './create-augmentation.dto';
import ObjectID from 'bson-objectid';
import { TrainService } from 'src/train/train.service';

@Injectable()
export class AugmentationService {
  constructor(
    @InjectModel(Augmentation.name) private augmentationModel: Model<AugmentationDocument>,
    @Inject(forwardRef(() => TrainService))
    private trainService: TrainService,
  ) {}

  async createAugmentation(postTrainDto: PostTrainDto): Promise<AugmentationDocument> {
    console.log(`[augmentation service] createAugmentation`);
    const createAugmentationDto = this.buildCreateAugmentationDto(postTrainDto);
    const augmentationDoc = new this.augmentationModel(createAugmentationDto);
    return augmentationDoc.save();
  }

  async deleteAugmentationBy_id(_id: string): Promise<AugmentationDocument> {
    console.log(`[augmentation service] deleteAugmentationBy_id`);
    return this.augmentationModel.findByIdAndDelete(_id).exec();
  }

  async getAugmentationByTrain_id(train_id: string): Promise<AugmentationDocument> {
    console.log(`[augmentation service] getAugmentationByTrain_id`);
    const train = await this.trainService.findTrainBy_id(train_id);
    const augmentation = await this.findOneById(train.augmentationId);
    return augmentation;
  }

  async findOneById(_id: string): Promise<AugmentationDocument> {
    console.log(`[augmentation service] findOneById`);
    return this.augmentationModel.findOne({ _id: _id }).exec();
  }

  buildCreateAugmentationDto(postTrainDto: PostTrainDto): CreateAugmentationDto {
    return {
      _id: (new ObjectID()).toHexString(),
      mirror: postTrainDto.mirror,
      flip: postTrainDto.flip,
      rotation90: postTrainDto.rotation90,
      zoom: postTrainDto.zoom,
      tilt: postTrainDto.tilt,
      shift: postTrainDto.shift,
      rotation: postTrainDto.rotation,
      contrast: postTrainDto.contrast,
      brightness: postTrainDto.brightness,
      smoothFiltering: postTrainDto.smoothFiltering,
      noise: postTrainDto.noise,
      colorNoise: postTrainDto.colorNoise,
      partialFocus: postTrainDto.partialFocus,
      shade: postTrainDto.shade,
      hue: postTrainDto.hue,
      saturation: postTrainDto.saturation,
      maxRandomAugmentCount: postTrainDto.maxRandomAugmentCount,
      probability: postTrainDto.probability,
      borderMode: postTrainDto.borderMode,
    }
  }
}

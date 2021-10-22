import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostTrainDto } from 'src/train/post-train.dto';
import { Augmentation, AugmentationDocument } from './augmentation.schema';
import { CreateAugmentationDto } from './create-augmentation.dto';
import ObjectID from 'bson-objectid';

@Injectable()
export class AugmentationService {
  constructor(
    @InjectModel(Augmentation.name) private augmentationModel: Model<AugmentationDocument>,
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

  buildCreateAugmentationDto(postTrainDto: PostTrainDto): CreateAugmentationDto {
    return {
      _id: (new ObjectID()).toHexString(),
      mirror: postTrainDto.augmentation.mirror,
      flip: postTrainDto.augmentation.flip,
      rotation90: postTrainDto.augmentation.rotation90,
      zoom: postTrainDto.augmentation.zoom,
      tilt: postTrainDto.augmentation.tilt,
      shift: postTrainDto.augmentation.shift,
      rotation: postTrainDto.augmentation.rotation,
      contrast: postTrainDto.augmentation.contrast,
      brightness: postTrainDto.augmentation.brightness,
      smoothFiltering: postTrainDto.augmentation.smoothFiltering,
      noise: postTrainDto.augmentation.noise,
      colorNoise: postTrainDto.augmentation.colorNoise,
      partialFocus: postTrainDto.augmentation.partialFocus,
      shade: postTrainDto.augmentation.shade,
      hue: postTrainDto.augmentation.hue,
      saturation: postTrainDto.augmentation.saturation,
      maxRandomAugmentCount: postTrainDto.augmentation.maxRandomAugmentCount,
      probability: postTrainDto.augmentation.probability,
      borderMode: postTrainDto.augmentation.borderMode,
    }
  }
}

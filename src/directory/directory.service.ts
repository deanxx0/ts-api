import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import ObjectID from 'bson-objectid';
import { Model } from 'mongoose';
import { PostTrainDto } from 'src/train/post-train.dto';
import { TrainService } from 'src/train/train.service';
import { CreateDirectoryDto } from './create-directory.dto';
import { Directory, DirectoryDocument } from './directory.schema';

@Injectable()
export class DirectoryService {
  constructor(
    @InjectModel(Directory.name) private directoryModel: Model<DirectoryDocument>,
    @Inject(forwardRef(() => TrainService))
    private trainService: TrainService,
  ) {}

  async createDirectory(postTrainDto: PostTrainDto): Promise<DirectoryDocument> {
    console.log(`[directory service] createDirectory`);
    const createDirectoryDto = this.buildCreateDirectoryDto(postTrainDto);
    const directoryDoc = new this.directoryModel(createDirectoryDto);
    return directoryDoc.save();
  }

  async deleteDirectoryBy_id(_id: string): Promise<DirectoryDocument> {
    console.log(`[directory service] deleteDirectoryBy_id`);
    return this.directoryModel.findByIdAndDelete(_id).exec();
  }

  async getDirectoryByTrain_id(train_id: string): Promise<DirectoryDocument> {
    console.log(`[directory service] getDirectoryByTrain_id`);
    const train = await this.trainService.findTrainBy_id(train_id);
    const directory = await this.findOneById(train.directoryId);
    return directory;
  }

  async findOneById(_id: string): Promise<DirectoryDocument> {
    console.log(`[directory service] findOneById`);
    return this.directoryModel.findOne({ _id: _id }).exec();
  }

  buildCreateDirectoryDto(postTrainDto: PostTrainDto): CreateDirectoryDto {
    return {
      _id: (new ObjectID()).toHexString(),
      directories: postTrainDto.directories,
    }
  }
}

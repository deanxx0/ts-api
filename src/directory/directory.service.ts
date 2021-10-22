import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import ObjectID from 'bson-objectid';
import { Model } from 'mongoose';
import { PostTrainDto } from 'src/train/post-train.dto';
import { CreateDirectoryDto } from './create-directory.dto';
import { Directory, DirectoryDocument } from './directory.schema';

@Injectable()
export class DirectoryService {
  constructor(
    @InjectModel(Directory.name) private directoryModel: Model<DirectoryDocument>,
  ) {}

  async createDirectory(postTrainDto: PostTrainDto): Promise<DirectoryDocument> {
    console.log(`[directory service] createDirectory`);
    const createDirectoryDto = this.buildCreateDirectoryDto(postTrainDto);
    const directoryDoc = new this.directoryModel(createDirectoryDto);
    return directoryDoc.save();
  }

  buildCreateDirectoryDto(postTrainDto: PostTrainDto): CreateDirectoryDto {
    return {
      _id: (new ObjectID()).toHexString(),
      directories: postTrainDto.directories,
    }
  }
}

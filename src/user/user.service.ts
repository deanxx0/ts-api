import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './user.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(userDto: UserDto): Promise<UserDocument> {
    console.log(`[user service] create`);
    const doc = new this.userModel(userDto);
    return doc.save();
  }

  async findOne(username: string): Promise<UserDocument> {
    console.log(`[user service] findOne`);
    return this.userModel.findOne({ username: username }).exec();
  }
}

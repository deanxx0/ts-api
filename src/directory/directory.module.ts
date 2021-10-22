import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrainModule } from 'src/train/train.module';
import { DirectoryController } from './directory.controller';
import { Directory, DirectorySchema } from './directory.schema';
import { DirectoryService } from './directory.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Directory.name, schema: DirectorySchema }]),
    forwardRef(() => TrainModule),
  ],
  controllers: [DirectoryController],
  providers: [DirectoryService],
  exports: [DirectoryService],
})
export class DirectoryModule {}

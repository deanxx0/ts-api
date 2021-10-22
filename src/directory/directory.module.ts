import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DirectoryController } from './directory.controller';
import { Directory, DirectorySchema } from './directory.schema';
import { DirectoryService } from './directory.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Directory.name, schema: DirectorySchema }]),
  ],
  controllers: [DirectoryController],
  providers: [DirectoryService],
  exports: [DirectoryService],
})
export class DirectoryModule {}

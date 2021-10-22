import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TrainModule } from './train/train.module';
import { DirectoryModule } from './directory/directory.module';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://db-admin:laon0118@10.101.0.44:27017/ts_api?authSource=admin`),
    AuthModule,
    UserModule,
    TrainModule,
    DirectoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

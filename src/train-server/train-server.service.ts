import { HttpService, Injectable } from '@nestjs/common';
import { ServerInfoService } from 'src/server-info/server-info.service';
import { PostTrainDto } from 'src/train/post-train.dto';
import { UserService } from 'src/user/user.service';
import { ReqTrainDto } from './req-train.dto';

@Injectable()
export class TrainServerService {
  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private serverInfoService: ServerInfoService,
  ) {}

  async postTrain(username: string, postTrainDto: PostTrainDto): Promise<string> {
    console.log(`[train server service] postTrain`);
    const userDoc = await this.userService.findOne(username);
    const serverDoc = await this.serverInfoService.findByServerIndex(userDoc.serverIndex);
    const reqTrainDto = this.buildReqTrainDto(postTrainDto);
    const resTrain = await this.httpService.post(
      `http://${serverDoc.uri}/trains`,
      reqTrainDto,
    ).toPromise();
    return resTrain.data.result.id; // serverTrainId
  }

  buildReqTrainDto(postTrainDto: PostTrainDto): ReqTrainDto {
    return {
      target_type: 'venus',
      image_list_path: 'Z:/det_01/img.txt',
      label_list_path: 'Z:/det_01/label.txt',
      val_image_list_path: 'Z:/det_01/img_val.txt',
      val_label_list_path: 'Z:/det_01/label_val.txt',
      train_params: {
        gpu_id: 0,
        iterations: postTrainDto.configuration.maxIteration,
        network: {
          batch_size: postTrainDto.configuration.batchSize,
          pretrain_data: postTrainDto.configuration.pretrainData,
          width: postTrainDto.configuration.width,
          height: postTrainDto.configuration.height,
          channels: postTrainDto.configuration.channels
        },
        patchmode: {
          enabled: 0,
          width: 0,
          height: 0,
        },
        roi: {
          enabled: 0,
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        },
        solver_param: {
          base_learning_rate: postTrainDto.configuration.baseLearningRate,
          gamma: postTrainDto.configuration.gamma,
          step_count: postTrainDto.configuration.stepCount,
        },
        augmentation: {
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
      },
      class_list: {
        1: '1',
        2: '2',
        3: '3',
      },
    }
  }
}

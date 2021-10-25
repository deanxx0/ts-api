import { forwardRef, HttpService, Inject, Injectable } from '@nestjs/common';
import { ServerInfoService } from 'src/server-info/server-info.service';
import { PostTrainDto } from 'src/train/post-train.dto';
import { TrainService } from 'src/train/train.service';
import { UserService } from 'src/user/user.service';
import { ReqTrainDto } from './req-train.dto';

@Injectable()
export class TrainServerService {
  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private serverInfoService: ServerInfoService,
    @Inject(forwardRef(() => TrainService))
    private trainService: TrainService,
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

  async getTrainStatus(username: string, _id: string): Promise<any> {
    console.log(`[train server service] getTrainStatus`);
    const userDoc = await this.userService.findOne(username);
    const serverDoc = await this.serverInfoService.findByServerIndex(userDoc.serverIndex);
    const trainDoc = await this.trainService.findTrainBy_id(_id);
    const resTrain = await this.httpService.get(
      `http://${serverDoc.uri}/trains/${trainDoc.serverTrainId}`
    ).toPromise();
    return resTrain.data.result.status;
  }

  async getTrainMetric(username: string, _id: string): Promise<any> {
    console.log(`[train server service] getTrainMetric`);
    const userDoc = await this.userService.findOne(username);
    const serverDoc = await this.serverInfoService.findByServerIndex(userDoc.serverIndex);
    const trainDoc = await this.trainService.findTrainBy_id(_id);
    const resTrainMetric = await this.httpService.get(
      `http://${serverDoc.uri}/trains/${trainDoc.serverTrainId}/metrics/pages/0`
    ).toPromise();
    const metrics: any[] = resTrainMetric.data.result;
    return {
      train_loss: metrics[metrics.length-1].train_loss,
      test_loss: metrics[metrics.length-1].test_loss,
      test_accuracy: metrics[metrics.length-1].test_accuracy,
      iou: metrics[metrics.length-1].test_accuracy2,
      iteration: metrics[metrics.length-1].current_iteration,
      max_iteration: metrics[metrics.length-1].max_iteration,
    }
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
        iterations: postTrainDto.maxIteration,
        network: {
          batch_size: postTrainDto.batchSize,
          pretrain_data: postTrainDto.pretrainData,
          width: postTrainDto.width,
          height: postTrainDto.height,
          channels: postTrainDto.channels
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
          base_learning_rate: postTrainDto.baseLearningRate,
          gamma: postTrainDto.gamma,
          step_count: postTrainDto.stepCount,
        },
        augmentation: {
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
      },
      class_list: {
        1: '1',
        2: '2',
        3: '3',
      },
    }
  }
}

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

  async postTrain(postTrainDto: PostTrainDto): Promise<string> {
    console.log(`[train server service] postTrain`);
    const serverDoc = await this.serverInfoService.findByServerIndex(postTrainDto.serverIndex);
    const reqTrainDto = this.buildReqTrainDto(postTrainDto);
    const resTrain = await this.httpService.post(
      `http://${serverDoc.uri}/trains`,
      reqTrainDto,
    ).toPromise();
    return resTrain.data.result.id; // serverTrainId
  }

  async getTrainStatus(_id: string): Promise<any> {
    console.log(`[train server service] getTrainStatus`);
    // const userDoc = await this.userService.findOne(username);
    const trainDoc = await this.trainService.findTrainBy_id(_id);
    const serverDoc = await this.serverInfoService.findByServerIndex(trainDoc.serverIndex);
    const resTrain = await this.httpService.get(
      `http://${serverDoc.uri}/trains/${trainDoc.serverTrainId}`
    ).toPromise();
    return resTrain.data.result.status;
  }

  async getTrainMetric(_id: string): Promise<any> {
    console.log(`[train server service] getTrainMetric`);
    // const userDoc = await this.userService.findOne(username);
    const trainDoc = await this.trainService.findTrainBy_id(_id);
    const serverDoc = await this.serverInfoService.findByServerIndex(trainDoc.serverIndex);
    const resTrainMetric = await this.httpService.get(
      `http://${serverDoc.uri}/trains/${trainDoc.serverTrainId}/metrics/pages/0`
    ).toPromise();
    const metrics: any[] = resTrainMetric.data.result;
    if (metrics.length == 0) {
      return {
        train_loss: 0,
        test_loss: 0,
        test_accuracy: 0,
        iou: 0,
        iteration: 0,
        max_iteration: 0,
      }
    } else {
      return {
        train_loss: metrics[metrics.length-1].train_loss,
        test_loss: metrics[metrics.length-1].test_loss,
        test_accuracy: metrics[metrics.length-1].test_accuracy,
        iou: metrics[metrics.length-1].test_accuracy2,
        iteration: metrics[metrics.length-1].current_iteration,
        max_iteration: metrics[metrics.length-1].max_iteration,
      }
    }
  }

  async getResource(): Promise<any[]> {
    console.log(`[train server service] getResource`);
    const serverIndex = [0, 1, 2, 3];
    const resources: any[] = await Promise.all(
      serverIndex.map(async index => {
        const serverDoc = await this.serverInfoService.findByServerIndex(index);
        const resResource = await this.httpService.get(
          `http://${serverDoc.uri}/resources`
          ).toPromise();
        return resResource.data.result;
      })
    );
    return resources;
    // const serverDoc = await this.serverInfoService.findByServerIndex(0);
    // const resResource = await this.httpService.get(
    //   `http://${serverDoc.uri}/resources`
    // ).toPromise();
    // return resResource.data.result;
  }

  buildReqTrainDto(postTrainDto: PostTrainDto): ReqTrainDto {
    return {
      target_type: 'venus',
      directories: postTrainDto.directories,
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

export class CreateConfigurationDto {
  _id: string;
  batchSize: number;
  pretrainData: string;
  width: number;
  height: number;
  channels: number;
  baseLearningRate: number;
  gamma: number;
  stepCount: number;
  maxIteration: number;
}

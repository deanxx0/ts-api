export class PostTrainDto {
  serverIndex: number;
  name: string;
  directories: string[];
  batchSize: number;
  pretrainData: string;
  width: number;
  height: number;
  channels: number;
  baseLearningRate: number;
  gamma: number;
  stepCount: number;
  maxIteration: number;
  mirror: boolean;
  flip: boolean;
  rotation90: boolean;
  zoom: number;
  tilt: number;
  shift: number;
  rotation: number;
  contrast: number;
  brightness: number;
  smoothFiltering: number;
  noise: number;
  colorNoise: number;
  partialFocus: number;
  shade: number;
  hue: number;
  saturation: number;
  maxRandomAugmentCount: number;
  probability: number;
  borderMode: number;
}
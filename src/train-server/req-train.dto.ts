export class ReqTrainDto {
  target_type: string;
  image_list_path: string;
  label_list_path: string;
  val_image_list_path: string;
  val_label_list_path: string;
  train_params: {
    gpu_id: number;
    iterations: number;
    network: {
      batch_size: number;
      pretrain_data: string;
      width: number;
      height: number;
      channels: number;
    },
    patchmode: {
      enabled: number;
      width: number;
      height: number;
    },
    roi: {
      enabled: number;
      x: number;
      y: number;
      width: number;
      height: number;
    },
    solver_param: {
      base_learning_rate: number;
      gamma: number;
      step_count: number;
    },
    augmentation: {
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
  };
  class_list: {
    1: string;
    2: string;
    3: string;
  };
}

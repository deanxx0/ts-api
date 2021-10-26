export class ResTrainInfoDto {
  id: string;
  serverTrainId: string;
  name: string;
  status: string;
  progress: number;
  createdAt: string;
  train_loss: number;
  test_loss: number;
  test_accuracy: number;
  iou: number;
  iteration: number;
  max_iteration: number;
  directoryId: string;
  configurationId: string;
  augmentationId: string;
}
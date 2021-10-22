import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Augmentation {
  @Prop()
  _id: string;
  @Prop()
  mirror: boolean;
  @Prop()
  flip: boolean;
  @Prop()
  rotation90: boolean;
  @Prop()
  zoom: number;
  @Prop()
  tilt: number;
  @Prop()
  shift: number;
  @Prop()
  rotation: number;
  @Prop()
  contrast: number;
  @Prop()
  brightness: number;
  @Prop()
  smoothFiltering: number;
  @Prop()
  noise: number;
  @Prop()
  colorNoise: number;
  @Prop()
  partialFocus: number;
  @Prop()
  shade: number;
  @Prop()
  hue: number;
  @Prop()
  saturation: number;
  @Prop()
  maxRandomAugmentCount: number;
  @Prop()
  probability: number;
  @Prop()
  borderMode: number;
}

export type AugmentationDocument = Augmentation & Document;
export const AugmentationSchema = SchemaFactory.createForClass(Augmentation);

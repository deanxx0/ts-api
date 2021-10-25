import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Configuration {
  @Prop()
  _id: string;
  @Prop()
  batchSize: number;
  @Prop()
  pretrainData: string;
  @Prop()
  width: number;
  @Prop()
  height: number;
  @Prop()
  channels: number;
  @Prop()
  baseLearningRate: number;
  @Prop()
  gamma: number;
  @Prop()
  stepCount: number;
  @Prop()
  maxIteration: number;
}

export type ConfigurationDocument = Configuration & Document;
export const ConfigurationSchema = SchemaFactory.createForClass(Configuration);

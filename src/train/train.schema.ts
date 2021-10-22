import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Train {
  @Prop()
  _id: string;
  @Prop()
  name: string;
  @Prop()
  serverTrainId: string;
  @Prop()
  directoryId: string;
  @Prop()
  configurationId: string;
  @Prop()
  augmentationId: string;
}

export type TrainDocument = Train & Document;
export const TrainSchema = SchemaFactory.createForClass(Train);

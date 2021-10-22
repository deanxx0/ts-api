import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Directory {
  @Prop()
  _id: string;
  @Prop()
  directories: string[];
}

export type DirectoryDocument = Directory & Document;
export const DirectorySchema = SchemaFactory.createForClass(Directory);

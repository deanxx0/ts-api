import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class ServerInfo {
  @Prop()
  _id: string;
  @Prop()
  serverIndex: number;
  @Prop()
  uri: string;
}

export type ServerInfoDocument = ServerInfo & Document;
export const ServerInfoSchema = SchemaFactory.createForClass(ServerInfo);

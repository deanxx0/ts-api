import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class User {
  @Prop()
  username: string;
  @Prop()
  password: string;
  @Prop()
  serverIndex: number;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

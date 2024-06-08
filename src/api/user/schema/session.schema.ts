import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type SessionDocument = Session & Document;

@Schema({
  timestamps: true,
  collection: "sessions"
})
export class Session {

  @Prop({ required: true })
  subscriber: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  group_name: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

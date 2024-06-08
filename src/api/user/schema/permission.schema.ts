import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PermissionDocument = Permission & Document;

@Schema({
  timestamps: true,
  collection: "permissions"
})
export class Permission {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  identifier: string;

  @Prop({ required: true })
  status: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserMapPermissionDocument = UserMapPermission & Document;

@Schema({
  timestamps: true,
  collection: "user_map_permissions"
})
export class UserMapPermission {

  @Prop({ required: true })
  permission: string;

  @Prop({ required: true, unique: true })
  permission_id: string;

  @Prop({ required: true })
  user_id: string;
}

export const UserMapPermissionSchema = SchemaFactory.createForClass(UserMapPermission);

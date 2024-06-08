import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepository } from "../../../common/database/repository/base.repository";
import { UserMapPermission, UserMapPermissionDocument } from "../schema/user-map-permission.schema";


@Injectable()
export class UserMapPermissionRepository extends BaseRepository<UserMapPermissionDocument> {
  constructor(
    @InjectModel(UserMapPermission.name)
    private userMapPermission: Model<UserMapPermissionDocument>
  ) {
    super(userMapPermission);
  }
}

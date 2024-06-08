import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepository } from "../../../common/database/repository/base.repository";
import { Permission, PermissionDocument } from "../schema/permission.schema";


@Injectable()
export class PermissionRepository extends BaseRepository<PermissionDocument> {
  constructor(
    @InjectModel(Permission.name)
    private permission: Model<PermissionDocument>
  ) {
    super(permission);
  }
}

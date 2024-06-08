import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepository } from "../../../common/database/repository/base.repository";
import { Group, GroupDocument } from "../schema/group.schema";


@Injectable()
export class GroupRepository extends BaseRepository<GroupDocument> {
  constructor(
    @InjectModel(Group.name)
    private group: Model<GroupDocument>
  ) {
    super(group);
  }
}

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepository } from "../../../common/database/repository/base.repository";
import { User, UserDocument } from "../schema/user.schema";
import { Session, SessionDocument } from "../schema/session.schema";


@Injectable()
export class SessionRepository extends BaseRepository<SessionDocument> {
  constructor(
    @InjectModel(Session.name)
    private session: Model<SessionDocument>
  ) {
    super(session);
  }
}

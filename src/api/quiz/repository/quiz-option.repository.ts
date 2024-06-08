import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepository } from "../../../common/database/repository/base.repository";
import { QuizOption, QuizOptionDocument } from "../schema/quiz-option.schema";


@Injectable()
export class QuizOptionRepository extends BaseRepository<QuizOptionDocument> {
  constructor(
    @InjectModel(QuizOption.name)
    private quizOption: Model<QuizOptionDocument>
  ) {
    super(quizOption);
  }
}

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepository } from "../../../common/database/repository/base.repository";
import { Quiz, QuizDocument } from "../schema/quiz.schema";
import { stringToMongooseObjectId } from "../../../common/utils";


@Injectable()
export class QuizRepository extends BaseRepository<QuizDocument> {
  constructor(
    @InjectModel(Quiz.name)
    private quiz: Model<QuizDocument>
  ) {
    super(quiz);
  }

  async findQuiz(): Promise<Quiz[]> {
    let data = await this.quiz.aggregate([
      {
        $lookup: {
          from: "options",
          localField: "_id",
          foreignField: "quiz",
          as: "options"
        }
      }
    ]);
    return data;
  }

  async findOneByQuizId(quiz_id: string): Promise<Quiz> {
    let data = await this.quiz.aggregate([
      {
        $match: {
          _id: stringToMongooseObjectId(quiz_id)
        }
      },
      {
        $lookup: {
          from: "options",
          localField: "_id",
          foreignField: "quiz",
          as: "options"
        }
      },
      {
        $limit: 1
      }
    ]);
    return data[0];
  }
}

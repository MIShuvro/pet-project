import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepository } from "../../../common/database/repository/base.repository";
import { QuizResult, QuizResultDocument } from "../schema/quiz-result.schema";
import { QuizResultQueryRequestDto } from "../dto/request/quiz-request.dto";
import { QuizResultMetric } from "../dto/response/quiz-response.dto";
import { plainToInstance } from "class-transformer";
import { buildFilterQueryForResultMetric } from "../../../common/utils";


@Injectable()
export class QuizResultRepository extends BaseRepository<QuizResultDocument> {
  constructor(
    @InjectModel(QuizResult.name)
    private quizResult: Model<QuizResultDocument>
  ) {
    super(quizResult);
  }

  buildDBQuery() {
    return [
      {
        $group: {
          _id: "$quiz",
          count: { $sum: 1 },
          totalCorrect: {
            $sum: {
              $cond: { if: "$is_correct", then: 1, else: 0 }
            }
          },
          totalWrong: {
            $sum: {
              $cond: { if: { $not: "$is_correct" }, then: 1, else: 0 }
            }
          }
        }
      },
      {
        $lookup: {
          from: "quizzes",
          localField: "_id",
          foreignField: "_id",
          as: "quizDetails"
        }
      },
      {
        $unwind: "$quizDetails"
      },
      {
        $project: {
          title: "$quizDetails.title",
          total_submissions: "$count",
          total_correct_submissions: "$totalCorrect",
          percentage_of_correct_submissions: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$totalCorrect", "$count"] },
                  100
                ]
              }
            ]
          },
          total_wrong_submissions: "$totalWrong",
          percentage_of_wrong_submissions: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$totalWrong", "$count"] },
                  100
                ]
              }
            ]
          }
        }
      }
    ];
  }

  async quizResultMetric(query: QuizResultQueryRequestDto): Promise<QuizResultMetric[]> {
    let filterObj = buildFilterQueryForResultMetric(query);
    let dbQuery = this.buildDBQuery()
    if (filterObj) {
      dbQuery.unshift(filterObj);
    }
    let data = await this.quizResult.aggregate(dbQuery);
    return plainToInstance(QuizResultMetric, data, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }
}

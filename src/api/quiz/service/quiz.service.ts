import { QuizRepository } from "../repository/quiz.repository";
import { BadRequestException, Injectable } from "@nestjs/common";
import { QuizOptionRepository } from "../repository/quiz-option.repository";
import {
  QuizOption,
  QuizRequestDto,
  QuizResultQueryRequestDto,
  QuizSubmissionRequestDto
} from "../dto/request/quiz-request.dto";
import { QuizResponseDto, QuizResultMetric } from "../dto/response/quiz-response.dto";
import { Quiz } from "../schema/quiz.schema";
import { plainToInstance } from "class-transformer";
import { IAuthorizedAdminUser, IAuthorizedUser } from "../../user/dto/response/user-response.dto";
import { QuizOptionDocument } from "../schema/quiz-option.schema";
import { QuizResult, QuizResultDocument } from "../schema/quiz-result.schema";
import { stringToMongooseObjectId } from "../../../common/utils";
import { QuizResultRepository } from "../repository/quiz-result.repository";
import { getPatternKey, getRedisQuizResultKey } from "../../../common/utils/redis.util";
import { RedisClientService } from "../../../common/redis-client/service/redis-service";
import { AppConfigService } from "../../../common/app-config/service/app-config.service";


@Injectable()
export class QuizService {
  constructor(private quizRepository: QuizRepository,
              private quizOptionRepository: QuizOptionRepository,
              private quizResultRepository: QuizResultRepository,
              private redisClient: RedisClientService) {
  }

  buildQuizOptionObject(options: QuizOption[], quiz: Quiz): {
    title: string,
    is_correct: boolean,
    quiz: Quiz
  }[] {
    let optionsObject = [];
    options.forEach(option => {
      optionsObject.push({
        title: option.title,
        is_correct: option.is_correct,
        quiz: quiz
      });
    });
    return optionsObject;
  }

  async createQuiz(dto: QuizRequestDto, user: IAuthorizedAdminUser): Promise<String> {
    let { title, status, options } = dto;
    let quiz = await this.quizRepository.save({
      title: title,
      status: status,
      creator_id: user._id
    });
    await this.quizOptionRepository.createMany(this.buildQuizOptionObject(options, quiz));
    return "CREATED";
  }

  async findQuiz(): Promise<QuizResponseDto[]> {
    let quizzes = await this.quizRepository.findQuiz();
    return plainToInstance(QuizResponseDto, quizzes, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }

  isCorrectOption(userGivenOptionId: string, options: QuizOptionDocument[]): boolean {
    let option = options.find(option => option._id == userGivenOptionId);
    return option && option.is_correct;
  }

  async isAlreadySubmitted(quiz_id: string, user_id: string): Promise<boolean> {
    let quizResult = await this.quizResultRepository.findOne({
      quiz: stringToMongooseObjectId(quiz_id),
      user: stringToMongooseObjectId(user_id)
    });
    return !!quizResult;
  }

  buildQuizResultObject(payload: {
    option_id: string,
    is_correct: boolean,
    quiz_id: string,
    user_id: string
  }) {
    let { option_id, is_correct, quiz_id, user_id } = payload;
    let data: QuizResult = {
      option_id,
      is_correct,
      quiz: stringToMongooseObjectId(quiz_id),
      user: stringToMongooseObjectId(user_id),
      timestamp: new Date()
    };
    return data;
  }

  async submission(dto: QuizSubmissionRequestDto, user: IAuthorizedUser): Promise<String> {
    let { quiz_id, option_id } = dto;
    let quiz = await this.quizRepository.findOneByQuizId(quiz_id);
    if (!quiz) {
      throw new BadRequestException("invalid quiz id");
    }
    let isAlreadySubmitted = await this.isAlreadySubmitted(quiz_id, user._id);
    if (isAlreadySubmitted) {
      throw new BadRequestException("already participated");
    }
    let isCorrect = this.isCorrectOption(option_id, quiz.options);
    let resultObject = this.buildQuizResultObject({
      option_id: option_id,
      is_correct: isCorrect,
      quiz_id: quiz_id,
      user_id: user._id
    });
    await this.quizResultRepository.save(resultObject);
    return "OK";
  }

  async setValueToRedis(key: string, metrics: QuizResultMetric[]) {
    await this.redisClient.setValueWithExpireInSec(key, JSON.stringify(metrics), 6 * 60 * 60);
  }

  async getQuizMetricsFromRedis(key: string): Promise<QuizResultMetric[]> {
    let value = await this.redisClient.getValue(key);
    let metrics: QuizResultMetric[] = [];
    if (value) {
      metrics = JSON.parse(value);
    }
    return plainToInstance(QuizResultMetric, metrics, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }

  async quizResultMetric(query: QuizResultQueryRequestDto): Promise<QuizResultMetric[]> {
    let quizResultRedisKey = getRedisQuizResultKey(query);
    let isKeyExists = await this.redisClient.checkKeyExist(quizResultRedisKey);
    if (isKeyExists) {
      // RETURN FROM REDIS
      return this.getQuizMetricsFromRedis(quizResultRedisKey);
    }
    let data = await this.quizResultRepository.quizResultMetric(query);
    await this.setValueToRedis(quizResultRedisKey, data);
    return data;
  }

  async onInsertQuizSubmission(quizResult: QuizResultDocument) {
    let keys = await this.redisClient.getKeys(getPatternKey());
    for (const key of keys) {
      await this.redisClient.delKey(key.split(AppConfigService.appConfig.REDIS_KEY_PREFIX)[1]);
    }
  }
}

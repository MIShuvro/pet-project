import { QuizService } from "../service/quiz.service";
import { QuizRepository } from "../repository/quiz.repository";
import { QuizOptionRepository } from "../repository/quiz-option.repository";
import { QuizResultRepository } from "../repository/quiz-result.repository";
import { RedisClientService } from "../../../common/redis-client/service/redis-service";
import { Quiz, QuizDocument } from "../schema/quiz.schema";
import { Test } from "@nestjs/testing";
import { QuizRequestDto, QuizResultQueryRequestDto, QuizSubmissionRequestDto } from "../dto/request/quiz-request.dto";
import { IAuthorizedAdminUser } from "../../user/dto/response/user-response.dto";
import { QuizOption } from "../schema/quiz-option.schema";
import { QuizResponseDto, QuizResultMetric } from "../dto/response/quiz-response.dto";
import { plainToInstance } from "class-transformer";
import { BadRequestException } from "@nestjs/common";
import { QuizResult } from "../schema/quiz-result.schema";
import { getRedisQuizResultKey } from "../../../common/utils/redis.util";


describe("Quiz Service", () => {
  let service: QuizService;
  let quizRepository: Partial<QuizRepository>;
  let quizOptionRepository: Partial<QuizOptionRepository>;
  let quizResultRepository: Partial<QuizResultRepository>;
  let redisClient: Partial<RedisClientService>;
  const user: IAuthorizedAdminUser = {
    _id: "1",
    name: "Admin",
    email: "admin@gmail.com",
    group_name: "admin",
    permissions: []
  };
  let dto: QuizRequestDto = {
    title: "Quiz: 1",
    status: "active",
    options: [{
      title: "Option: 1",
      is_correct: false
    },
      {
        title: "Option: 1",
        is_correct: false
      }]
  };

  const submissionDto: QuizSubmissionRequestDto = {
    quiz_id: "6662d8d5b27090970850ccbe",
    option_id: "option123"
  };

  beforeEach(async () => {

    quizRepository = {
      save: jest.fn().mockImplementation(dto => Promise.resolve(Quiz)),
      createMany: jest.fn().mockImplementation(dto => Promise.resolve()),
      findQuiz: jest.fn().mockImplementation(id => Promise.resolve([Quiz])),
      findOneByQuizId: jest.fn().mockImplementation(id => Promise.resolve(Quiz))
    };

    quizOptionRepository = {
      save: jest.fn().mockImplementation(dto => Promise.resolve(QuizOption)),
      createMany: jest.fn().mockImplementation(dto => Promise.resolve([QuizOption]))
    };

    quizResultRepository = {
      save: jest.fn().mockImplementation(dto => Promise.resolve(QuizResult)),
      quizResultMetric: jest.fn().mockImplementation(dto=>Promise.resolve([QuizResultMetric]))
    };

    redisClient = {
      checkKeyExist: jest.fn().mockImplementation(dto => Promise.resolve()),
      getValue: jest.fn().mockImplementation(dto => Promise.resolve())
    };

    const module = await Test.createTestingModule({
      providers: [QuizService, {
        provide: QuizRepository,
        useValue: quizRepository
      }, {
        provide: QuizOptionRepository,
        useValue: quizOptionRepository
      },
        {
          provide: QuizResultRepository,
          useValue: quizResultRepository
        }, {
          provide: RedisClientService,
          useValue: redisClient
        }]
    }).compile();
    service = module.get(QuizService);
  });

  it("can create an instance of the quiz service", async function() {
    expect(service).toBeDefined();
  });

  it("should create a quiz and return \"CREATED\"", async () => {

    quizRepository.save = jest.fn().mockResolvedValue({
      id: dto.title,
      title: dto.title,
      status: dto.status,
      creator_id: user._id
    });
    quizOptionRepository.createMany = jest.fn().mockResolvedValue([QuizOption]);

    const result = await service.createQuiz(dto, user);
    expect(quizRepository.save).toHaveBeenCalledWith({
      title: dto.title,
      status: dto.status,
      creator_id: user._id
    });

    let quiz = await quizRepository.save({
      title: dto.title,
      status: dto.status,
      creator_id: user._id
    });
    let optionObj = service.buildQuizOptionObject(dto.options, quiz);
    expect(quizOptionRepository.createMany).toHaveBeenCalledWith(optionObj);

    expect(result).toBe("CREATED");
  });

  it("should throw an error if the user has already participated", async () => {
    const dto: QuizSubmissionRequestDto = {
      quiz_id: "1",
      option_id: "1"
    };
    quizRepository.findOneByQuizId = jest.fn().mockResolvedValue(dto);
    service.isAlreadySubmitted = jest.fn().mockResolvedValue(true);

    await expect(service.submission(dto, user)).rejects.toThrow(BadRequestException);
    await expect(service.submission(dto, user)).rejects.toThrow("already participated");
  });


  it("should throw an error if quiz id is invalid", async () => {
    const dto: QuizSubmissionRequestDto = {
      quiz_id: "invalid_quiz_id",
      option_id: "option123"
    };

    quizRepository.findOneByQuizId = jest.fn().mockResolvedValue(null);

    await expect(service.submission(dto, user)).rejects.toThrow(BadRequestException);
    await expect(service.submission(dto, user)).rejects.toThrow("invalid quiz id");
  });


  it("should save the result and return \"OK\" if the submission is valid", async () => {


    const resultObject = {
      option_id: "option123",
      is_correct: true,
      quiz_id: "quiz123",
      user_id: "user123"
    };
    let quiz = await quizRepository.findOneByQuizId(submissionDto.quiz_id);
    quizRepository.findOneByQuizId = jest.fn().mockResolvedValue(dto);
    service.isAlreadySubmitted = jest.fn().mockResolvedValue(false);
    service.isCorrectOption = jest.fn().mockReturnValue(true);
    service.buildQuizResultObject = jest.fn().mockReturnValue(resultObject);
    quizResultRepository.save = jest.fn().mockResolvedValue(resultObject);

    const result = await service.submission(submissionDto, user);
    expect(quizRepository.findOneByQuizId).toHaveBeenCalledWith(submissionDto.quiz_id);
    expect(service.isAlreadySubmitted).toHaveBeenCalledWith(submissionDto.quiz_id, user._id);
    expect(service.isCorrectOption).toHaveBeenCalledWith(submissionDto.option_id, dto.options);
    expect(quizResultRepository.save).toHaveBeenCalledWith(resultObject);
    expect(result).toBe("OK");
  });


  it("should find quizzes and return them as QuizResponseDto", async () => {

    let quizzes = await quizRepository.findQuiz();
    const result = await service.findQuiz();
    expect(quizRepository.findQuiz).toHaveBeenCalled();

    const expectedResponse = plainToInstance(QuizResponseDto, quizzes, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });

    expect(result).toEqual(expectedResponse);
  });

  it("should return quiz result metrics from Redis if key exists", async () => {
    const query: QuizResultQueryRequestDto = {
      range_start_at: new Date(),
      range_end_at: new Date()
    };
    const mockMetrics: QuizResultMetric[] = [];
    let quizResultRedisKey = getRedisQuizResultKey(query);
    redisClient.checkKeyExist = jest.fn().mockResolvedValue(true);
    let quizMetrics = await service.getQuizMetricsFromRedis(quizResultRedisKey);
    expect(quizMetrics).toEqual(mockMetrics);
  });

  it("should fetch quiz result metrics from repository if key does not exist in Redis", async () => {
    const query: QuizResultQueryRequestDto = {
      range_start_at: new Date(),
      range_end_at: new Date()
    };
    redisClient.checkKeyExist = jest.fn().mockResolvedValue(false);
    let quizMetrics = await quizResultRepository.quizResultMetric(query)
    expect(quizMetrics).toEqual([QuizResultMetric]);
  });

});

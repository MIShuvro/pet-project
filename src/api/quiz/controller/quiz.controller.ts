import { ApiCreatedResponse, ApiOkResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Injectable,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  Query, Sse
} from "@nestjs/common";
import { ResponseInterceptor } from "../../../common/interceptors/response.interceptor";
import { BaseApiResponse, SwaggerBaseApiResponse } from "../../../common/dto/base-api-response.dto";
import { QuizService } from "../service/quiz.service";
import { QuizRequestDto, QuizResultQueryRequestDto, QuizSubmissionRequestDto } from "../dto/request/quiz-request.dto";
import { QuizResponseDto, QuizResultMetric } from "../dto/response/quiz-response.dto";
import PermissionGuard from "../../../common/guard/permission.guard";
import { ADMIN_PERMISSION } from "../../../common/constants";
import { AuthGuard } from "../../../common/guard/auth.guard";
import { interval, Observable, map, mergeMap, Subject, takeUntil } from "rxjs";


@ApiTags("Quiz")
@Injectable()
@UseInterceptors(ResponseInterceptor)
@Controller({
  version: "1",
  path: "quizzes"
})
export class QuizController {

  constructor(private quizService: QuizService) {
  }

  private readonly stop$ = new Subject<void>();

  @Post()
  @UseGuards(PermissionGuard([ADMIN_PERMISSION.QUIZ_CREATE]))
  @ApiSecurity("admin-auth")
  @ApiCreatedResponse({ type: SwaggerBaseApiResponse(String, HttpStatus.CREATED) })
  async createQuiz(@Body() dto: QuizRequestDto, @Req() req: any): Promise<BaseApiResponse<String>> {
    await this.quizService.createQuiz(dto, req.user);
    return {
      data: null,
      message: "CREATED"
    };
  }

  @Get()
  @ApiOkResponse({ type: SwaggerBaseApiResponse([QuizResponseDto], HttpStatus.OK) })
  async findQuiz(): Promise<BaseApiResponse<QuizResponseDto[]>> {
    let data = await this.quizService.findQuiz();
    return {
      data,
      message: "OK"
    };
  }

  @Post("submission")
  @UseGuards(AuthGuard)
  @ApiSecurity("auth")
  @ApiOkResponse({ type: SwaggerBaseApiResponse(String, HttpStatus.OK) })
  async submission(@Body() dto: QuizSubmissionRequestDto, @Req() req: any): Promise<BaseApiResponse<String>> {
    await this.quizService.submission(dto, req.user);
    return {
      data: null,
      message: "OK"
    };
  }

  @Get("result-metrics")
  @UseGuards(PermissionGuard([ADMIN_PERMISSION.QUIZ_RESULT]))
  @ApiSecurity("admin-auth")
  @ApiOkResponse({ type: SwaggerBaseApiResponse([QuizResultMetric], HttpStatus.OK) })
  async quizResultMetrics(@Query() query: QuizResultQueryRequestDto): Promise<BaseApiResponse<QuizResultMetric[]>> {
    let data = await this.quizService.quizResultMetric(query);
    return {
      message: "OK",
      data
    };
  }


  @Sse("result-metrics/event")
  @UseGuards(PermissionGuard([ADMIN_PERMISSION.QUIZ_RESULT]))
  @ApiSecurity("admin-auth")
  @ApiOkResponse({ type: SwaggerBaseApiResponse([QuizResultMetric], HttpStatus.OK) })
  async sendQuizResultMetricsEvent(): Promise<Observable<{ data: QuizResultMetric[], message: string }>> {
    return interval(1000).pipe(mergeMap(async (num) => {
      let metrics = await this.quizService.quizResultMetric({ range_end_at: null, range_start_at: null });
      return { data: metrics, message: "OK" };
    }), takeUntil(this.stop$));
  }

  @Get("stop-sending-event")
  @UseGuards(PermissionGuard([ADMIN_PERMISSION.QUIZ_RESULT]))
  @ApiSecurity("admin-auth")
  async stopEvents(): Promise<BaseApiResponse<String>> {
    this.stop$.next();
    return {
      data: null,
      message: "OK"
    };
  }

}

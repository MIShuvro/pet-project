import * as process from "process";
import { QuizResultQueryRequestDto } from "../../api/quiz/dto/request/quiz-request.dto";
import { AppConfigService } from "../app-config/service/app-config.service";

export function getRedisQuizResultKey(query: QuizResultQueryRequestDto) {
  if (query.range_start_at && query.range_end_at) {
    return `quiz:start:${query.range_start_at.toISOString()}-end:${query.range_end_at.toISOString()}`;
  }
  if (query.range_start_at) {
    return `quiz:start:${query.range_start_at.toISOString()}`;
  }
  if (query.range_end_at) {
    return `quiz:end:${query.range_end_at.toISOString()}`;
  }
  return "quiz:";
}

export function getPatternKey() {
  return AppConfigService.appConfig.REDIS_KEY_PREFIX + "*";
}


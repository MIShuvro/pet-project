import { Module } from "@nestjs/common";
import { QuizService } from "./service/quiz.service";
import { QuizRepository } from "./repository/quiz.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { Quiz, QuizSchema } from "./schema/quiz.schema";
import { QuizOption, QuizOptionSchema } from "./schema/quiz-option.schema";
import { QuizController } from "./controller/quiz.controller";
import { QuizOptionRepository } from "./repository/quiz-option.repository";
import { UserModule } from "../user/user.module";
import { QuizResultRepository } from "./repository/quiz-result.repository";
import { QuizResult, QuizResultDocument, QuizResultSchema } from "./schema/quiz-result.schema";
import { ModuleRef } from "@nestjs/core";

@Module({
  imports: [MongooseModule.forFeatureAsync([
    {
      name: Quiz.name,
      useFactory: () => {
        const schema = QuizSchema;
        return schema;
      }
    },
    {
      name: QuizOption.name,
      useFactory: () => {
        const schema = QuizOptionSchema;
        return schema;
      }
    },
    {
      name: QuizResult.name,
      inject: [ModuleRef],
      useFactory: (moduleRef: ModuleRef) => {
        const schema = QuizResultSchema;
        schema.post("save", async function() {
          let quizResult = this as QuizResultDocument;
          let quizService = moduleRef.get(QuizService, { strict: false });
          await quizService.onInsertQuizSubmission(quizResult);
        });
        return schema;
      }
    }
  ]), UserModule],
  controllers: [QuizController],
  providers: [QuizService, QuizRepository, QuizOptionRepository, QuizResultRepository],
  exports: []
})
export class QuizModule {
}

import { Module } from "@nestjs/common";
import { AppController } from "./index/app.controller";
import { UserModule } from "./user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "../common/database/database.module";
import { AppConfigModule } from "../common/app-config/app-config.module";
import { QuizModule } from "./quiz/quiz.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { RedisClientModule } from "../common/redis-client/redis-client.module";

@Module({
  imports: [
    AppConfigModule, {
      ...JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get("APP_SECRET")
        })
      }),
      global: true
    }, DatabaseModule, AuthModule, UserModule, QuizModule, RedisClientModule],
  controllers: [AppController],
  providers: []
})
export class ApiModule {
}

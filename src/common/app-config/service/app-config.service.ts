import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "../environment";

@Injectable()
export class AppConfigService {
  public static appConfig: EnvironmentVariables;

  constructor(private configService: ConfigService<EnvironmentVariables>) {
    AppConfigService.appConfig = {
      MONGO_DB_URL: this.configService.get("MONGO_DB_URL"),
      APP_USER_SECRET: this.configService.get("APP_USER_SECRET"),
      APP_ADMIN_SECRET: this.configService.get("APP_ADMIN_SECRET"),
      ENABLE_MONGO_DB_LOG: this.configService.get("ENABLE_MONGO_DB_LOG"),
      REDIS_URL: this.configService.getOrThrow("REDIS_URL"),
      REDIS_KEY_PREFIX: this.configService.get("REDIS_KEY_PREFIX", "ph:"),
      REDIS_DB_INDEX: this.configService.getOrThrow("REDIS_DB_INDEX", "3")
    };
    Logger.log("AppConfigService initialized");
  }
}

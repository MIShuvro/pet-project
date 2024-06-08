export interface EnvironmentVariables {
  MONGO_DB_URL: string;
  APP_USER_SECRET: string;
  APP_ADMIN_SECRET: string;
  ENABLE_MONGO_DB_LOG: boolean;
  REDIS_URL: string;
  REDIS_KEY_PREFIX: string;
  REDIS_DB_INDEX: string;
  PORT:number
}

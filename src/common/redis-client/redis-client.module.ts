import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisClientService } from './service/redis-service';

@Global()
@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      imports:[ConfigModule],
      useFactory: async (configService: ConfigService): Promise<RedisModuleOptions> => {
        console.log("REDIS_URL====",configService.get('REDIS_URL'));
        return {
          config: {
            url: configService.get('REDIS_URL'),
            db: configService.get('REDIS_DB_INDEX'),
            keyPrefix: configService.get('REDIS_KEY_PREFIX'),
          },
        };
      },
    }),
  ],
  providers: [RedisClientService],
  exports: [RedisClientService],
})
export class RedisClientModule {}

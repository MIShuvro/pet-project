import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports:[ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log('DB URL ', configService.get('MONGO_DB_URL'));
        if (configService.get('ENABLE_MONGO_DB_LOG') === 'true') {
          mongoose.set('debug', false);
        }
        return {
          uri: configService.get('MONGO_DB_URL'),
          useNewUrlParser: true
        };
      }
    })
  ]
})
export class DatabaseModule {}

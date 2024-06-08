import { Global, Module } from '@nestjs/common';
import { MyLogger } from './service/logger.service';


@Global()
@Module({
  providers: [MyLogger],
  exports: [MyLogger],
})
export class LoggerModule {}

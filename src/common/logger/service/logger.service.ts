import { Injectable, Logger, LoggerService } from '@nestjs/common';

@Injectable()
export class MyLogger implements LoggerService {
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    Logger.log(message);
  }

  fatal(message: any, ...optionalParams: any[]) {
  }

  error(message: any, ...optionalParams: any[]) {
    Logger.error(message);
  }

  warn(message: any, ...optionalParams: any[]) {
    Logger.warn(message);
  }

  debug?(message: any, ...optionalParams: any[]) {
    Logger.debug(message);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    Logger.verbose(message);
  }
}

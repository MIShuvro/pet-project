import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Response, Request } from 'express';
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log(exception);
    Logger.error(exception, HttpExceptionFilter.name);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    try {
      let { statusCode, message, error } = exception.getResponse() as any;
      message = typeof message === 'string' ? message : message.join(',');

      if (statusCode >= 400 && statusCode <= 499) {
        let code = statusCode ;
        return response.status(HttpStatus.OK).json({
          status_code: code,
          message: message,
          payload: ctx.getRequest<Request>().body,
          error: [error],
          data: null
        });
      }

      return response.status(statusCode).json({
        status_code: statusCode,
        message: message,
        payload: null,
        error: [],
        data: null
      });
    } catch (error) {
      let code = 500;
      let message = exception.message;
      Logger.error(exception, HttpExceptionFilter.name);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to process the request',
        payload: null,
        error: [exception.message],
        data: null
      });
    }
  }
}

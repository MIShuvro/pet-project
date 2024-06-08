import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Index')
export class AppController {
  constructor() {
  }

  @Get()
  getHello(): string {
    return 'App is running...';
  }
}

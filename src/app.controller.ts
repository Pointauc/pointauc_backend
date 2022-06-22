import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class AppController {
  @Get()
  async getHello(): Promise<string> {
    return 'ok';
  }
}

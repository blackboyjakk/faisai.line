import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import 'dotenv/config'
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

};
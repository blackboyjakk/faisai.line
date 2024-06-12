import { Controller, Get } from '@nestjs/common';
import { MasterService } from './master.service';
import { Public } from 'src/auth/auth.guard';

@Controller('master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}


  @Get('/company')
  @Public()
  findAllCompany() {
    return this.masterService.findAllCompany();
  }
}

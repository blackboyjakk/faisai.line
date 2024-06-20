import { Module } from '@nestjs/common';
import { MasterService } from './master.service';
import { MasterController } from './master.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/_entities/company.entity';
import { Role } from 'src/_entities/role.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Company,Role])],
  controllers: [MasterController],
  providers: [MasterService],
})
export class MasterModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserVerify } from 'src/_entities/userVerify.entity';
import { User } from 'src/_entities/user.entity';
import { Employee } from 'src/_entities/employee.entity';
import { HttpModule } from '@nestjs/axios';
import { Company } from 'src/_entities/company.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [HttpModule.register({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  }), TypeOrmModule.forFeature([User, UserVerify, Employee, Company])],
  controllers: [AuthController],
  providers: [AuthService,MailService, {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },],
})
export class AuthModule { }

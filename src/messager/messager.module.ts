import { Module } from '@nestjs/common';
import { MessagerController } from 'src/messager/messager.controller';
import { MessagerService } from './messager.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/_entities/user.entity';
import { DocumentModule } from 'src/document/document.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), DocumentModule],
  controllers: [MessagerController],
  providers: [MessagerService],
})
export class MessagerModule { }

import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { HttpModule } from '@nestjs/axios';
import { WorkflowService } from 'src/workflow/workflow.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workflow } from 'src/workflow/entities/workflow.entity';
import { WorkflowAction } from 'src/workflow/entities/workflow-action';
import { WorkflowStep } from 'src/workflow/entities/workflow-step.entity';

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.SAP_APP_BASE_URL,
      auth: { username: 'dm_pt1', password: 'protos#2024' }
    }),
    TypeOrmModule.forFeature([Workflow, WorkflowStep, WorkflowAction])
  ],
  controllers: [DocumentController],
  providers: [DocumentService, WorkflowService, Workflow, Workflow, WorkflowAction],
  exports: [DocumentService]
})
export class DocumentModule { }

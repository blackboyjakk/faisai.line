import { Module } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowController } from './workflow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowStep } from './entities/workflow-step.entity';
import { Workflow } from './entities/workflow.entity';
import { WorkflowAction } from './entities/workflow-action';
import { RequestContextModule } from 'src/common/request-context/request-context-modeul';

@Module({
  imports:[RequestContextModule,TypeOrmModule.forFeature([Workflow,WorkflowStep,WorkflowAction])],
  controllers: [WorkflowController],
  providers: [WorkflowService],
  exports:[WorkflowService]
})
export class WorkflowModule {}

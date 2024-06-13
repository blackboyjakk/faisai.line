import { Module } from '@nestjs/common';
import { WorkflowStepService } from './workflow-step.service';
import { WorkflowStepController } from './workflow-step.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowStep } from './entities/workflow-step.entity';

@Module({
  imports:[TypeOrmModule.forFeature([WorkflowStep])],
  controllers: [WorkflowStepController],
  providers: [WorkflowStepService],
})
export class WorkflowStepModule {}

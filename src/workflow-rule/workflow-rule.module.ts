import { Module } from '@nestjs/common';
import { WorkflowRuleService } from './workflow-rule.service';
import { WorkflowRuleController } from './workflow-rule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowRule } from './entities/workflow-rule.entity';
import { WorkflowCondition } from 'src/workflow-rule/entities/workflow-condition';

@Module({
  imports:[TypeOrmModule.forFeature([WorkflowRule,WorkflowCondition])],
  controllers: [WorkflowRuleController],
  providers: [WorkflowRuleService],
})
export class WorkflowRuleModule {}

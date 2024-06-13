import { Injectable } from '@nestjs/common';
import { CreateWorkflowRuleDto } from './dto/create-workflow-rule.dto';
import { UpdateWorkflowRuleDto } from './dto/update-workflow-rule.dto';

@Injectable()
export class WorkflowRuleService {
  create(createWorkflowRuleDto: CreateWorkflowRuleDto) {
    return 'This action adds a new workflowRule';
  }

  findAll() {
    return `This action returns all workflowRule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workflowRule`;
  }

  update(id: number, updateWorkflowRuleDto: UpdateWorkflowRuleDto) {
    return `This action updates a #${id} workflowRule`;
  }

  remove(id: number) {
    return `This action removes a #${id} workflowRule`;
  }
}

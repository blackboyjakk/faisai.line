import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkflowRuleService } from './workflow-rule.service';
import { CreateWorkflowRuleDto } from './dto/create-workflow-rule.dto';
import { UpdateWorkflowRuleDto } from './dto/update-workflow-rule.dto';

@Controller('workflow-rule')
export class WorkflowRuleController {
  constructor(private readonly workflowRuleService: WorkflowRuleService) {}

  @Post()
  create(@Body() createWorkflowRuleDto: CreateWorkflowRuleDto) {
    return this.workflowRuleService.create(createWorkflowRuleDto);
  }

  @Get()
  findAll() {
    return this.workflowRuleService.findAll();
  }

  @Get(':ruleCode')
  findOne(@Param('ruleCode') ruleCode: string) {
    return this.workflowRuleService.findOne(ruleCode);
  }

  @Patch(':workflowCode/:stepCode/:ruleCode')
  async update(@Param('workflowCode') workflowCode: string,@Param('stepCode') stepCode: string,@Param('ruleCode') ruleCode: string, @Body() updateWorkflowRuleDto: UpdateWorkflowRuleDto) {
    return await this.workflowRuleService.update(workflowCode,stepCode,ruleCode, updateWorkflowRuleDto);
  }

  @Delete(':ruleCode')
  remove(@Param('ruleCode') ruleCode: string) {
    return this.workflowRuleService.remove(ruleCode);
  }
}

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workflowRuleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkflowRuleDto: UpdateWorkflowRuleDto) {
    return this.workflowRuleService.update(+id, updateWorkflowRuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workflowRuleService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkflowStepService } from './workflow-step.service';
import { CreateWorkflowStepDto } from './dto/create-workflow-step.dto';
import { UpdateWorkflowStepDto } from './dto/update-workflow-step.dto';

@Controller('workflow-step')
export class WorkflowStepController {
  constructor(private readonly workflowStepService: WorkflowStepService) {}

  @Post()
  create(@Body() createWorkflowStepDto: CreateWorkflowStepDto) {
    return this.workflowStepService.create(createWorkflowStepDto);
  }

  @Get()
  findAll() {
    return this.workflowStepService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workflowStepService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkflowStepDto: UpdateWorkflowStepDto) {
    return this.workflowStepService.update(id, updateWorkflowStepDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workflowStepService.remove(id);
  }
}

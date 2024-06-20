import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { Admin, Public } from 'src/auth/auth.guard';
@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) { }

  @Admin()
  @Post()
  create(@Body() createWorkflowDto: CreateWorkflowDto) {
    return this.workflowService.createWorkflow(createWorkflowDto);
  }
  @Admin()
  @Get()
  findAll() {
    return this.workflowService.findAllWorkflow();
  }
  @Admin()
  @Get(':companyCode/:type')
  findOne(@Param('companyCode') companyCode: string, @Param('companyCode') type: string) {
    return this.workflowService.findOne(companyCode, type);
  }
  @Admin()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkflowDto: UpdateWorkflowDto) {
    return this.workflowService.updateWorkflow(+id, updateWorkflowDto);
  }
  @Admin()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workflowService.removeWorkflow(+id);
  }


}

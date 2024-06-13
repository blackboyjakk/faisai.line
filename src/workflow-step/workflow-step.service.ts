import { Injectable } from '@nestjs/common';
import { CreateWorkflowStepDto } from './dto/create-Workflow-step.dto';
import { UpdateWorkflowStepDto } from './dto/update-Workflow-step.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkflowStep } from './entities/workflow-step.entity';

@Injectable()
export class WorkflowStepService {
  constructor(
    @InjectRepository(WorkflowStep)
    private readonly repoWorkflowStep: Repository<WorkflowStep>) {

  }

  create(createWorkflowStepDto: CreateWorkflowStepDto) {
    this.repoWorkflowStep.save({ ...createWorkflowStepDto })

  }

  async findAll() {
    const wf = await this.repoWorkflowStep.find({
      order: {
        seq: 'asc',
      }
    })
    return wf;
  }

  async findOne(stepCode: string) { }


  update(stepCode: string, updateWorkflowStepDto: UpdateWorkflowStepDto) {
    this.repoWorkflowStep.update({ companyCode: updateWorkflowStepDto.companyCode, stepCode: updateWorkflowStepDto.stepCode }, { stepName: updateWorkflowStepDto.stepName, seq: updateWorkflowStepDto.seq, action: updateWorkflowStepDto.action })

  }

  remove(stepCode: string) {
    return `This action removes a #${stepCode} WorkflowStep`;
  }
}

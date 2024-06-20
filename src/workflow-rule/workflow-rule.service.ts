import { Injectable } from '@nestjs/common';
import { CreateWorkflowRuleDto } from './dto/create-workflow-rule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateWorkflowRuleDto } from './dto/update-workflow-rule.dto';
import { WorkflowRule } from './entities/workflow-rule.entity';
import { WorkflowCondition } from 'src/workflow-rule/entities/workflow-condition';
import { Condition } from '../../client/src/components/config/workflow.dto';

@Injectable()
export class WorkflowRuleService {
  constructor(
    @InjectRepository(WorkflowRule)
    private readonly repoWorkflowRule: Repository<WorkflowRule>,
    @InjectRepository(WorkflowCondition)
    private readonly repoWorkflowCondition: Repository<WorkflowCondition>) {

  }

  async create(createWorkflowRuleDto: CreateWorkflowRuleDto) {
    const maxSeq = await this.repoWorkflowRule.maximum('seq')
    return this.repoWorkflowRule.save({ ...createWorkflowRuleDto, seq: maxSeq + 1 }).then(() => {

      createWorkflowRuleDto.conditions.forEach(async (element, index: number) => {

       await this.repoWorkflowCondition.save({ ...element, ...createWorkflowRuleDto, seq: index + 1 })
      });

    })
  }

  async findAll() {
    const wf = await this.repoWorkflowRule.find({
      order: {
        seq: 'asc',
      }
    })
    return wf;
  }

  async findOne(RuleCode: string) { }


  async update(WorkflowCode: string, stepCode: string, RuleCode: string, updateWorkflowRuleDto: UpdateWorkflowRuleDto) {

  return await this.repoWorkflowRule.update({
      companyCode: updateWorkflowRuleDto.companyCode,
      workflowCode: WorkflowCode,
      stepCode: stepCode,
      ruleCode: RuleCode,
    },
      {
        seq: updateWorkflowRuleDto.seq,
        actorType: updateWorkflowRuleDto.actorType,
        actorName: updateWorkflowRuleDto.actorName,
      }).then(async () => {
        return await this.repoWorkflowCondition.delete({
          companyCode: updateWorkflowRuleDto.companyCode,
          workflowCode: WorkflowCode,
          stepCode: stepCode,
          ruleCode: RuleCode,
        }).then(async () => {

          const conditions =  updateWorkflowRuleDto.conditions.map(m => {
            const condition =
            {
              ...m, companyCode: updateWorkflowRuleDto.companyCode,
              workflowCode: WorkflowCode,
              stepCode: stepCode,
              ruleCode: RuleCode,
            };
            return condition;
          })
         return await this.repoWorkflowCondition.save(conditions)
        })
      })

    // updateWorkflowRuleDto.conditions.forEach((condition:Condition)=>{
    //   this.repoWorkflowCondition.upsert({ 
    //     companyCode:updateWorkflowRuleDto.companyCode,
    //     workflowCode: WorkflowCode,
    //     stepCode: stepCode,
    //     ruleCode:RuleCode,
    //     seq:condition.seq},{
    //       field:condition.field,
    //       operator:condition.operator,
    //       value:condition.value});


    //     })
    // })
  }

  remove(RuleCode: string) {
    return `This action removes a #${RuleCode} WorkflowRule`;
  }
}


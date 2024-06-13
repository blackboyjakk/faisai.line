import { Injectable } from '@nestjs/common';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { BapiRequisitionItem } from '../_interface/bapiRequisitionItems.interface'
import { Repository } from 'typeorm';
import { WorkflowStep } from '../workflow-step/entities/workflow-step.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkflowCondition } from './entities/workflow-condition';
import { WorkflowRule } from './entities/workflow-rule.entity';
import { Workflow } from './entities/workflow.entity';
import { WorkflowAction } from './entities/workflow-action';
import { Company } from '../_entities/company.entity';
import { Employee } from 'src/_entities/employee.entity';
import { RequestContext } from 'src/common/request-context/request-context.model';
@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(Workflow)
    private readonly repoWorkflow: Repository<Workflow>,
    @InjectRepository(WorkflowStep)
    private readonly repoWorkflowStep: Repository<WorkflowStep>,
    @InjectRepository(WorkflowAction)
    private readonly repoAction: Repository<WorkflowAction>,
  ) { }

  createWorkflow(createWorkflowDto: CreateWorkflowDto) {
    this.repoWorkflow.save({companyCode:createWorkflowDto.companyCode,workflowCode:createWorkflowDto.workflowCode,workflowName:createWorkflowDto.workflowName,docType:createWorkflowDto.docType})

  }

  async findAllWorkflow() {
    const wf = await this.repoWorkflow.find({
      relations: { steps: true },
      order: {
        steps: {
          seq: 'asc',
        },
      }
    })
    return wf;
  }

  async findOne(companyCode: string, workflowCode: string) { }


  updateWorkflow(id: number, updateWorkflowDto: UpdateWorkflowDto) {
    this.repoWorkflow.update({companyCode:updateWorkflowDto.companyCode,workflowCode:updateWorkflowDto.workflowCode},{workflowName:updateWorkflowDto.workflowName,docType:updateWorkflowDto.docType})
    
  }

  removeWorkflow(id: number) {
    return `This action removes a #${id} workflow`;
  }



  async getWorkflowConfig(companyCode: string, type: string) {
    const wf = await this.repoWorkflow.findOne({
      where: {
        companyCode: companyCode,
        docType: type,
      },
      relations: {
        steps: {
          rules: {
            conditions: true
          }
        }
      },
      order: {
        steps: {
          seq: 'asc',
          rules: {
            seq: 'asc',
            conditions: {
              seq: 'asc'
            }
          }
        }
      }
    })
    return wf;
  }
  async genDocWorkflow(doc: BapiRequisitionItem, type: string) {
    const emp: Employee = RequestContext.currentEmployee;
    const wf = await this.getWorkflowConfig(emp.companyCode, type)

    if (wf.steps) {

      wf.steps = wf.steps.map(step => {
        let role: string = '';

        for (let rule of step.rules) {

          if (rule.conditions?.length > 0) {

            const condition = rule.conditions.reduce(
              (result: string, cond: WorkflowCondition) => {
                result += ` ${cond.logic} ${doc[cond.field]} ${cond.operator} ${cond.value}`
                return result
              }
              , '')

            const flag = eval(condition)
            if (flag) {
              step.rules = [rule]
              return step
            }
          } else {
            return step
          }

        }


      }).filter(r => r != undefined)
      return wf;
    }
  }
  async getWorkflowAction(docNo, docItem, docYear) {
    return await this.repoAction.findBy({ docNo, docItem, docYear })

  }
  async approve(doc: BapiRequisitionItem, type: string, note: string) {
    const emp: Employee = RequestContext.currentEmployee;

    const wfActions = await this.getWorkflow(doc, type)

    if (wfActions.every(w => w.status == 'W')) {
      this.repoAction.save(wfActions)
    }

    const wfAction = wfActions.find(w => w.status == 'W')


    this.repoAction.update({
      companyCode: wfAction.companyCode
      , docNo: wfAction.docNo
      , docItem: wfAction.docItem
      , docYear: wfAction.docYear
      , workflowCode: wfAction.workflowCode
      , seq: wfAction.seq
      , stepCode: wfAction.stepCode

    }, { status: 'A', empId: emp.empId })

    // const step = wf.steps.find(s => !wfActions.some(a => a.companyCode == s.companyCode && a.workflowCode == s.workflowCode && a.stepCode == s.stepCode))


  }
  async getWorkflow(doc: BapiRequisitionItem, type: string) {
    const wfAction = await this.getWorkflowAction(doc.preqNo, doc.preqItem, (new Date(doc.preqDate))?.getFullYear())

    if (wfAction.length > 0) {
      return wfAction
    } else {
      return await this.simulateWorkflow(doc, type)
    }
  }
  async simulateWorkflow(doc: BapiRequisitionItem, type: string) {
    const emp: Employee = RequestContext.currentEmployee;
    const wf = await this.genDocWorkflow(doc, type)
    return wf.steps.map((step) => {
      if (step?.rules?.length > 0) {
        const rule = step.rules.at(0);
        return {
          docNo: doc.preqNo,
          docItem: doc.preqItem,
          docYear: (new Date(doc.preqDate))?.getFullYear(),
          companyCode: emp.companyCode,
          workflowCode: step.workflowCode,
          stepCode: step.stepCode,
          stepName: step.stepName,
          ruleCode: rule.ruleCode,
          seq: step.seq,
          actorType: rule.actorType,
          actorName: rule.actorName,
          action: step.action,
          status: 'W',
          empId: emp.empId,
        }
      }
    })
  }
}

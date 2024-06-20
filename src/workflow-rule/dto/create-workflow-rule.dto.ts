import { WorkflowCondition } from "src/workflow-rule/entities/workflow-condition"

export class CreateWorkflowRuleDto {
    companyCode:string
    workflowCode:string
    stepCode:string
    ruleCode:string
    ruleName:string
    seq:number
    actorType:string
    actorName:string
    conditions:WorkflowCondition[]
}


  

export type Workflow = {
  companyCode: string
  workflowCode: string
  workflowName: string
  docType: string
  steps: Step[]
}

export type Step ={
  companyCode: string
  workflowCode: string
  stepCode: string
  stepName: string
  seq: number
  action: string
  rules: Rule[]
}

export type Rule= {
  companyCode: string
  workflowCode: string
  stepCode: string
  ruleCode: string
  seq: number
  actorType: string
  actorName: string
  conditions: Condition[]
}

export type Condition= {
  companyCode: string
  workflowCode: string
  stepCode: string
  ruleCode: string
  seq: number
  logic: string
  field: string
  operator: string
  value: string
}

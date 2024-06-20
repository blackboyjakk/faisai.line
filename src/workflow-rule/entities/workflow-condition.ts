import { WorkflowStep } from '../../workflow-step/entities/workflow-step.entity';

import {AbstractEntity} from 'src/_entities/_abtract.entity'
import { Entity, Column, PrimaryColumn ,ManyToOne, JoinColumn, PrimaryGeneratedColumn} from 'typeorm';
import { WorkflowRule } from './workflow-rule.entity';
@Entity()
export class WorkflowCondition  extends AbstractEntity<WorkflowCondition>{

    @PrimaryColumn({length:4})
    companyCode :string
    
    @Column({length:10})
    workflowCode:string;

    @Column({length:10})
    stepCode :string

    @PrimaryColumn({length:10})
    ruleCode :string

    @PrimaryColumn()
    seq:number


    @Column({length:20})
    field:string

    @Column({length:3})
    operator:string
    
    @Column({length:100})
    value:string
    
    @JoinColumn([{name:'companyCode',referencedColumnName:'companyCode'},{name:'workflowCode',referencedColumnName:'workflowCode'},{name:'stepCode',referencedColumnName:'stepCode'},{name:'ruleCode',referencedColumnName:'ruleCode'}])
    @ManyToOne(()=>WorkflowRule, (rule:WorkflowRule) => rule.conditions)
    rule:WorkflowRule

}
import { Workflow } from '../../workflow/entities/workflow.entity';

import {AbstractEntity} from 'src/_entities/_abtract.entity'
import { Entity, Column, PrimaryColumn ,ManyToOne, OneToMany, JoinColumn} from 'typeorm';
import { WorkflowRule } from '../../workflow/entities/workflow-rule.entity';
import { WorkflowAction } from '../../workflow/entities/workflow-action';
@Entity()
export class WorkflowStep  extends AbstractEntity<WorkflowStep>{

    @PrimaryColumn({length:4})
    companyCode :string
    
    @PrimaryColumn({length:10})
    workflowCode:string;

    @PrimaryColumn({length:10})
    stepCode :string

    @Column({length:100,nullable:true})
    stepName :string

    @Column()
    seq:number
     
    @Column({ length: 1, nullable: true })
    action: string;
    
    @JoinColumn([{name:'companyCode',referencedColumnName:'companyCode'},{name:'workflowCode',referencedColumnName:'workflowCode'}])
    @ManyToOne(()=>Workflow, (workflow:Workflow) => workflow.steps)   
    workflow:Workflow

    @OneToMany(() => WorkflowRule,(rule:WorkflowRule )=> rule.step)
    rules:WorkflowRule[]
    
    @OneToMany(() => WorkflowAction,(action:WorkflowAction )=> action.step)
    actions: WorkflowAction[];
  
}
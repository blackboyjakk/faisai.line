import { WorkflowStep } from '../../workflow-step/entities/workflow-step.entity';

import {AbstractEntity} from 'src/_entities/_abtract.entity'
import { Entity, Column, PrimaryColumn ,ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { WorkflowCondition } from './workflow-condition';
@Entity()
export class WorkflowAction  extends AbstractEntity<WorkflowAction>{

    @PrimaryColumn({length:4})
    companyCode :string

    @PrimaryColumn({length:20})
    docNo:string

    @PrimaryColumn({length:6})
    docItem:string

    @PrimaryColumn()
    docYear:number
    
    @PrimaryColumn({length:10})
    workflowCode:string;

    @PrimaryColumn()
    seq:number

    @PrimaryColumn({length:10})
    stepCode :string
    
    @Column({length:100,nullable:true})
    stepName :string

    @Column({length:10})
    ruleCode :string

    @Column({length:20})
    actorType:string
    
    @Column({length:50})
    actorName:string

    @Column({length:1})
    action:string

    @Column({length:1})
    status:string

    @Column({length:10})
    empId:string;

    @Column({length:1,nullable:true})
    postStatus:string;
    @Column({length:100,nullable:true})
    message:string;

    @CreateDateColumn()
    createDate:Date;

    @UpdateDateColumn()
    modifyDate:Date;

    // @JoinColumn([{name:'companyCode',referencedColumnName:'companyCode'},{name:'workflowCode',referencedColumnName:'workflowCode'},{name:'stepCode',referencedColumnName:'stepCode'}])
    @JoinColumn([{name:'companyCode',referencedColumnName:'companyCode'},{name:'workflowCode',referencedColumnName:'workflowCode'},{name:'stepCode',referencedColumnName:'stepCode'}])
    @ManyToOne(()=>WorkflowStep, (step:WorkflowStep) => step.actions)
    step:WorkflowStep
    
}
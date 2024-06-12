
import { Entity, Column, PrimaryColumn, OneToMany, JoinTable, JoinColumn } from 'typeorm';
import  {WorkflowStep}  from './workflow-step.entity';
import {AbstractEntity} from 'src/_entities/_abtract.entity'
@Entity()
export class Workflow  extends AbstractEntity<Workflow>{

    @PrimaryColumn({length:4})
    companyCode :string
    
    @PrimaryColumn({length:10})
    workflowCode:string;


    @Column({length:100})
    workflowName :string

    @Column({length:3})
    docType:string

    @OneToMany(() => WorkflowStep,(step:WorkflowStep )=> step.workflow)
    steps:WorkflowStep[]
}
import { WorkflowStep } from '../../workflow-step/entities/workflow-step.entity';

import { AbstractEntity } from 'src/_entities/_abtract.entity'
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { WorkflowCondition } from './workflow-condition';
@Entity()
export class WorkflowRule extends AbstractEntity<WorkflowRule> {

    @PrimaryColumn({ length: 4 })
    companyCode: string

    @PrimaryColumn({ length: 10 })
    workflowCode: string;

    @PrimaryColumn({ length: 10 })
    stepCode: string

    @PrimaryColumn({ length: 10 })
    ruleCode: string

    @Column()
    seq: number

    @Column({ length: 20 })
    actorType: string

    @Column({ length: 50 })
    actorName: string

    // @JoinColumn([{name:'companyCode',referencedColumnName:'companyCode'},{name:'workflowCode',referencedColumnName:'workflowCode'},{name:'stepCode',referencedColumnName:'stepCode'}])
    @JoinColumn([{ name: 'companyCode', referencedColumnName: 'companyCode' }, { name: 'workflowCode', referencedColumnName: 'workflowCode' }, { name: 'stepCode', referencedColumnName: 'stepCode' }])
    @ManyToOne(() => WorkflowStep, (step: WorkflowStep) => step.rules)
    step: WorkflowStep

    @OneToMany(() => WorkflowCondition, (condition: WorkflowCondition) => condition.rule)
    conditions: WorkflowCondition[];

}
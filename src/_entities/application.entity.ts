import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { AbstractEntity } from './_abtract.entity';
import { Company } from './company.entity';

@Entity()
export class Application extends AbstractEntity<Application> {



  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn({ length: 4 })
  companyCode: string

  @Column({ length: 10 })
  type: string

  @Column({ length: 50 })
  channelId: string


  @Column({ length: 100 })
  channelSecret: string


  @Column({ length: 200 })
  channelToken: string

  @ManyToOne(() => Company, (company) => company.applications)  
  @JoinColumn({name:'companyCode',referencedColumnName:'companyCode'})
  company: Company

}
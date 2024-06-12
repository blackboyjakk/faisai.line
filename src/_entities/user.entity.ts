import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AbstractEntity } from './_abtract.entity';
import { Company } from './company.entity';
import { UserVerify } from './userVerify.entity';
import { EmpMapRole } from './empMapRole.entity';
import { Employee } from './employee.entity';

@Entity()
export class User extends AbstractEntity<User> {




  @PrimaryColumn({ length: 100 })
  userId: string

  @Column({ length: 100 })
  email: string

  @PrimaryColumn({ length: 4 })
  companyCode: string

  @Column()
  isActive: boolean;

  @Column({ length: 10 })
  appType: string

  @PrimaryColumn({ length: 10 })
  empId: string


  @ManyToOne(() => Company, (company) => company.users)
  @JoinColumn({name:'companyCode',referencedColumnName:'companyCode'})
  company: Company


  @ManyToOne(() => Employee, (employee) => employee.users)
  @JoinColumn([{name:'companyCode',referencedColumnName:'companyCode'},{name:'empId',referencedColumnName:'empId'},])
  employee: Employee;
}
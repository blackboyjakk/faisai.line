import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from './_abtract.entity';
import { Company } from './company.entity';
import { User } from './user.entity';
import { EmpMapRole } from './empMapRole.entity';

@Entity()
export class Employee extends AbstractEntity<Employee> {


  @PrimaryColumn({ length: 4 })
  companyCode: string

  @PrimaryColumn({ length: 10 })
  empId: string

  @Column({ length: 100 })
  email: string

  @Column({ length: 100 })
  name: string



  @ManyToOne(() => Company, (company) => company.employees)  
  @JoinColumn({name:'companyCode',referencedColumnName:'companyCode'})
  company: Company

  @OneToMany(() => User, (user) => user.employee)
  users: User[]

  @OneToMany(() => EmpMapRole, (roles) => roles.employee)
  mapRoles: EmpMapRole[];
}
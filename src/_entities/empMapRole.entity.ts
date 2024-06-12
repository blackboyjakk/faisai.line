import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from './_abtract.entity';
import { Role } from './role.entity';
import { Authorization } from './authorization.entity';
import { User } from './user.entity';
import { Employee } from './employee.entity';

@Entity()
export class EmpMapRole extends AbstractEntity<EmpMapRole> {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 4 }) 
  companyCode: string;

  @Column({ length: 10 }) 
  empId: string;
  
  @Column({ length: 20 }) 
  roleCode: string;
  
  @ManyToOne(() => Employee, (employee) => employee.mapRoles)
  @JoinColumn([{name:'companyCode',referencedColumnName:'companyCode'},{name:'empId',referencedColumnName:'empId'}])
  employee: Employee; 

  @ManyToOne(() => Role, (role) => role.mapEmp)    
  @JoinColumn({name:'roleCode'})
  role: Role;





}
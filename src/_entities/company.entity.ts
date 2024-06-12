import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from './_abtract.entity';
import { Employee } from './employee.entity';
import { Application } from './application.entity';
import { User } from './user.entity';

@Entity()
export class Company extends AbstractEntity<Company> {


  @PrimaryColumn({ length: 4 })
  companyCode: string;


  @Column({ length: 3 })
  country: string;

  @Column({ length: 100 })
  nameEn: string;

  @Column({ length: 100 })
  nameTh: string;

  @Column()
  validFrom: Date;

  @Column()
  validTo: Date;

  @OneToMany(() => Employee, (employee) => employee.company)
  employees: Employee[];

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Application, (app) => app.company)
  applications: Application[];
}
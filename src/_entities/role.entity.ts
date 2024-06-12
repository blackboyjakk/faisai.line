import { Entity, Column, PrimaryColumn, OneToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from './_abtract.entity';
import { roleMapAuth } from './roleMapAuth.entity';
import { EmpMapRole } from './empMapRole.entity';

@Entity()
export class Role extends AbstractEntity<Role> {

  @PrimaryColumn({ length: 20 }) code: string;

  @Column({ length: 100 })
  name: string

  @OneToMany(() => roleMapAuth, (mapping) => mapping.role)
  mapAuths: roleMapAuth[];

  @OneToOne(() => EmpMapRole, (mapping) => mapping.role)
  mapEmp: EmpMapRole;

}
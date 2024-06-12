import { Entity, Column, PrimaryColumn, OneToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from './_abtract.entity';
import { roleMapAuth } from './roleMapAuth.entity';

@Entity()
export class Authorization extends AbstractEntity<Authorization> {

  @PrimaryColumn({ length: 4 }) code: string;

  @Column({ length: 100 })
  name: string

  @OneToMany(() => roleMapAuth, (auths) => auths.auth)
  mapRoles: roleMapAuth[];

}
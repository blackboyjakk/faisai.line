import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToOne, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AbstractEntity } from './_abtract.entity';
import { Role } from './role.entity';
import { Authorization } from './authorization.entity';

@Entity()
export class roleMapAuth extends AbstractEntity<roleMapAuth> {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 }) roleCode: string;

  @Column({ length: 4 }) authCode: string;

  @ManyToOne(() => Role, (role) => role.mapAuths)
  @JoinColumn({name:'roleCode'})
  role: Role;

  @ManyToOne(() => Authorization, (auth) => auth.mapRoles)  
  @JoinColumn({name:'authCode'})
  auth: Authorization;
}
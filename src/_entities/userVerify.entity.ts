import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from './_abtract.entity';
import { User } from './user.entity';

@Entity()
export class UserVerify extends AbstractEntity<UserVerify> {



  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  userId: string

  @Column({ length: 4,nullable:true })
  companyCode: string

  @Column({ length: 100 })
  email: string

  @Column({ length: 5 })
  otp: string

  @Column()
  isVerify: boolean;


  @Column()
  otpExpired: Date

}
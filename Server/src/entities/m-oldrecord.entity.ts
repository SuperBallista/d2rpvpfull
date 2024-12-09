import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('m_oldrecord')
export class MOldRecord {
  @PrimaryGeneratedColumn()
  orderNum: number;

  @Column()
  date: Date;

  @Column()
  winner: string;

  @Column()
  loser: string;

  @Column()
  wScore: number;

  @Column()
  lScore: number;
} 
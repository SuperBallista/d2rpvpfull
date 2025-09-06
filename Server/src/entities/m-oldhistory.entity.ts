import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('m_oldhistory')
export class MOldHistory {
  @PrimaryGeneratedColumn()
  orderNum: number;

  @Column()
  date: Date;

  @Column()
  winner: string;

  @Column({ nullable: true })
  win2?: string;

  @Column({ nullable: true })
  win3?: string;

  @Column({ nullable: true })
  win4?: string;

  @Column()
  loser: string;

  @Column({ nullable: true })
  lose2?: string;

  @Column({ nullable: true })
  lose3?: string;

  @Column({ nullable: true })
  lose4?: string;

  @Column()
  wScore: number;

  @Column()
  lScore: number;
}

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('m_oldhistory')
export class MOldHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', nullable: true })
  date?: Date;

  @Column({ type: 'integer', nullable: true })
  orderNum?: number;

  @Column({ type: 'integer', nullable: true })
  checked?: number;

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

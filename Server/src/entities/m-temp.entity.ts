import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('m_temp') // 데이터베이스의 'm_temp' 테이블과 매핑
export class MTemp {
  @PrimaryGeneratedColumn()
  orderNum: number; // PRIMARY KEY, AUTO_INCREMENT

  @Column({ type: 'date', nullable: true })
  date?: Date; // NULL 허용

  @Column({ length: 255, nullable: true })
  winner?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  loser?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  win2?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  win3?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  win4?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  lose2?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  lose3?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  lose4?: string; // NULL 허용

  @Column({ type: 'int', nullable: true })
  wScore?: number; // NULL 허용

  @Column({ type: 'int', nullable: true })
  lScore?: number; // NULL 허용

  @Column({ type: 'int', nullable: true })
  checked?: number; // NULL 허용
}

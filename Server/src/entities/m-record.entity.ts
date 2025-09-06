import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('m_record') // 데이터베이스의 'm_record' 테이블과 매핑
export class MRecord {
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

  @Column({ type: 'float', nullable: true })
  addScore?: number; // NULL 허용
}

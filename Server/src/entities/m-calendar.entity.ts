import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('m_calendar') // 데이터베이스의 'm_calendar' 테이블과 매핑
export class MCalendar {
  @Column({ length: 255, nullable: true })
  yearmonth?: string; // NULL 허용

  @PrimaryColumn({ length: 255 })
  yearmonthdate: string; // PRIMARY KEY, NOT NULL

  @Column({ type: 'int', nullable: true })
  date?: number; // NULL 허용

  @Column({ length: 255, nullable: true })
  text?: string; // NULL 허용
}

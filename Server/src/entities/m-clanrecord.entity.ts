import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('m_clanrecord') // 데이터베이스의 'm_clanrecord' 테이블과 매핑
export class MClanRecord {
  @PrimaryGeneratedColumn()
  orderNumber: number; // PRIMARY KEY, AUTO_INCREMENT

  @Column({ length: 255, nullable: true })
  winner?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  loser?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  draw1?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  draw2?: string; // NULL 허용

  @Column({ type: 'date', nullable: false })
  gameDate: Date; // NOT NULL

  @Column({ type: 'int', default: 0 })
  approved: number;
}

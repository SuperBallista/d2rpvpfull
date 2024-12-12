import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('m_clanrecordtemp') // 데이터베이스의 'm_clanrecordtemp' 테이블과 매핑
export class MClanRecordTemp {
  @PrimaryGeneratedColumn({ name: 'order_num' }) // PRIMARY KEY, AUTO_INCREMENT
  orderNumber: number; 

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
}

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('m_oldrecord') // 데이터베이스의 'b_oldrecord' 테이블과 매핑
export class MOldRecord {
  @PrimaryGeneratedColumn()
  orderNum: number; // PRIMARY KEY, AUTO_INCREMENT

  @Column({ type: 'date', nullable: false })
  Month: Date; // NOT NULL

  @Column({ length: 255, nullable: false })
  nickname: string; // NOT NULL

  @Column({ type: 'float', nullable: false })
  bScore: number; // NOT NULL

  @Column({ type: 'float', nullable: false })
  lScore: number; // NOT NULL

  @Column({ type: 'int', nullable: true })
  class?: number; // NULL 허용
}

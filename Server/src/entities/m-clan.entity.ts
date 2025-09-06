import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('m_clan') // 데이터베이스의 'm_clan' 테이블과 매핑
export class MClan {
  @Column({ type: 'int', default: 0, nullable: false })
  score: number; // NOT NULL, 기본값 0

  @PrimaryColumn({ length: 255 })
  name: string; // PRIMARY KEY, NOT NULL
}

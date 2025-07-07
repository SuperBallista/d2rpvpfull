import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('z_oldrecord') // 데이터베이스의 'b_oldrecord' 테이블과 매핑
export class ZOldRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', nullable: false })
  date: Date;

  @Column({ type: 'double precision', nullable: false })
  wScore: number;

  @Column({ type: 'double precision', nullable: false })
  lScore: number;

  @Column({ type: 'integer', nullable: true })
  orderNum?: number;
}

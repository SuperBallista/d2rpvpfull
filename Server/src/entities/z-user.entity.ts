import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('z_user') // 데이터베이스의 'z_user' 테이블과 매핑
export class ZUser {
  @PrimaryColumn({ name: "Nickname", length: 255 })
  nickname: string; // PRIMARY KEY, NOT NULL

  @Column({ name: "PW", length: 255, nullable: true })
  pw?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  email?: string; // NULL 허용

  @Column({ name: "BScore", type: 'float', nullable: true })
  bScore?: number; // NULL 허용

  @Column({ name: "LScore", type: 'float', nullable: false })
  lScore: number; // NOT NULL

  @Column({ name: "Class", type: 'int', nullable: true })
  class?: number; // NULL 허용

  @Column({ name: "Lastgame", type: 'datetime', nullable: true })
  lastgame?: Date; // NULL 허용

  @Column({ name: "Records", type: 'int', default: 0 })
  records: number; // NOT NULL, 기본값 0

  @Column({ name: "RScore", type: 'float', default: 0 })
  rScore: number; // 기본값 0

  @Column({ length: 255, nullable: true })
  challenge?: string; // NULL 허용

  @Column({ type: 'date', nullable: true })
  challengeDate?: Date; // NULL 허용

  @Column({ type: 'int', default: 15 })
  playStopDate: number; // 기본값 15

  @Column({ type: 'tinyint', width: 1, default: 0 })
  playStop: boolean; // 기본값 0

  @Column({length: 255})
  memo: string

}

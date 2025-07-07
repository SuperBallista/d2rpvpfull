import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MClan } from './m-clan.entity';

@Entity('m_user') // 데이터베이스의 'm_user' 테이블과 매핑
export class MUser {
  @PrimaryColumn({ name: "Nickname", length: 255 })
  nickname: string; // PRIMARY KEY, NOT NULL

  @Column({ name: "PW", length: 255, nullable: true })
  pw?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  email?: string; // NULL 허용

  @Column({ name: "BScore", type: 'double precision', nullable: true })
  bScore?: number; // NULL 허용

  @Column({ name: "LScore", type: 'double precision', nullable: false })
  lScore: number; // NOT NULL

  @Column({ name: "Class", type: 'integer', nullable: true })
  class?: number; // NULL 허용

  @Column({ name: "Lastgame", type: 'timestamp', nullable: true })
  lastgame?: Date; // NULL 허용

  @Column({ name: "Records", type: 'integer', default: 0 })
  records: number; // NOT NULL, 기본값 0

  @Column({ name: "RScore", type: 'double precision', default: 0 })
  rScore: number; // 기본값 0

  @ManyToOne(() => MClan, { nullable: true })
  @JoinColumn({ name: 'clan' })
  clan: MClan | null;

  @Column({ name: "Challenge", length: 255, nullable: true })
  challenge?: string; // NULL 허용

  @Column({ name: "ChallengeDate", type: 'timestamp', nullable: true })
  challengeDate?: Date; // NULL 허용

  @Column({ name: "PlayStopDate", type: 'integer', default: 15, nullable: true })
  playStopDate?: number; // 기본값 15, NULL 허용

  @Column({ name: "PlayStop", type: 'boolean', default: false, nullable: true })
  playStop?: boolean; // 기본값 0, NULL 허용

  @Column({length: 255})
  memo: string

}

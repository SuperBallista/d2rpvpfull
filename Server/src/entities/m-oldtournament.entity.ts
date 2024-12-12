import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('m_oldtournament') // 데이터베이스의 'm_oldtournament' 테이블과 매핑
export class MOldTournament {
  @PrimaryGeneratedColumn()
  orderNum: number; // PRIMARY KEY, AUTO_INCREMENT

  @Column({ length: 255, nullable: false })
  eventname: string; // NOT NULL

  @Column({ length: 255, nullable: false })
  championship: string; // NOT NULL

  @Column({ length: 255, nullable: true })
  runnerUp?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  place3rd?: string; // NULL 허용

  @Column({ type: 'int', nullable: false })
  numberTeams: number; // NOT NULL
}

import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('m_eventrecord') // 데이터베이스의 'm_eventrecord' 테이블과 매핑
@Unique(['eventname']) // eventname의 고유 제약 조건
export class MEventRecord {
  @PrimaryGeneratedColumn({name: "OrderNum"})
  orderNum: number; // PRIMARY KEY, AUTO_INCREMENT

  @Column({ length: 255, nullable: false })
  eventname: string; // UNIQUE, NOT NULL

  @Column({ length: 255, nullable: false })
  Championship1: string; // NOT NULL

  @Column({ length: 255, nullable: true })
  Championship2?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  Championship3?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  Championship4?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  Runner_up1?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  Runner_up2?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  Runner_up3?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  Runner_up4?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  Place3rd1?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  Place3rd2?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  Place3rd3?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  Place3rd4?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  semifinalist1?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  semifinalist2?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  semifinalist3?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  semifinalist4?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  quarterfinalist1?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  quarterfinalist2?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  quarterfinalist3?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  quarterfinalist4?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  quarterfinalist5?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  quarterfinalist6?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  quarterfinalist7?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  quarterfinalist8?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  quarterfinalist9?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  quarterfinalist10?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  quarterfinalist11?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  quarterfinalist12?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  quarterfinalist13?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  quarterfinalist14?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  quarterfinalist15?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  quarterfinalist16?: string; // NULL 허용

  @Column({ type: 'int', nullable: false })
  teamSize: number; // NOT NULL

  @Column({ type: 'int', nullable: false })
  numberteams: number; // NOT NULL

  @Column({ type: 'int', nullable: false })
  accept: number; // NOT NULL

  @Column({ length: 255, nullable: true })
  Eventhost?: string; // NULL 허용

  @Column({type:"text" , nullable: false})
  memo?: string

}

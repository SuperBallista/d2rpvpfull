import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('account') // 데이터베이스의 'account' 테이블과 매핑
export class Account {
  @PrimaryColumn({ name: "id", type: 'int' })
  id: number; // PRIMARY KEY, NOT NULL

  @Column({ name: "password", length: 255, nullable: true })
  password?: string; // NULL 허용

  @Column({ length: 255, nullable: true })
  how: string; 

  @Column({ length: 255, nullable: true })
  account: string; 

  @Column({ length: 255, nullable: true })
  babapk?: string; 

  @Column({ length: 255, nullable: true })
  zpke?: string; 

  @Column({ length: 255, nullable: true })
  mpk?: string; 

  @Column({ length: 255, nullable: true })
  email: string; 
}

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('b_clan') // 데이터베이스의 'b_clan' 테이블과 매핑
export class BClan {
    @PrimaryGeneratedColumn()
    orderNum: number; // PRIMARY KEY, AUTO_INCREMENT

    @Column({length: 255, nullable: false})
    name: string;
  
    @Column({ type: 'float', default: 0, nullable: false })
  Bscore: number; // NOT NULL, 기본값 0
   
  @Column({ type: 'int', default: 0, nullable: false })
  Lscore: number; // NOT NULL, 기본값 0
}

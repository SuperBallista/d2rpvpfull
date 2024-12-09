import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';

@Entity('comment') // 데이터베이스의 'comment' 테이블과 매핑
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number; // PRIMARY KEY, AUTO_INCREMENT

  @Column({ type: 'int', nullable: false })
  postId: number; // FOREIGN KEY를 참조 (MUL)

  @Column({ length: 255, nullable: false })
  nickname: string; // FOREIGN KEY를 참조 (MUL)

  @Column({ type: 'text', nullable: false })
  content: string; // NOT NULL

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // NOT NULL, 현재 타임스탬프
}

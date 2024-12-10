import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';

@Entity('comments') // 데이터베이스의 'comments' 테이블과 매핑
export class Comment {
  @PrimaryGeneratedColumn( {name: 'comment_id'})
  commentId: number; // PRIMARY KEY, AUTO_INCREMENT

  @Column({ name: 'post_id', type: 'int', nullable: false })
  postId: number; // FOREIGN KEY를 참조 (MUL)

  @Column({ name: 'Nickname', length: 255, nullable: false })
  nickname: string; // FOREIGN KEY를 참조 (MUL)

  @Column({ name: 'content', type: 'text', nullable: false })
  content: string; // NOT NULL

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // NOT NULL, 현재 타임스탬프
}

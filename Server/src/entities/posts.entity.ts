import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('posts') // 데이터베이스의 'posts' 테이블과 매핑
export class Post {
  @PrimaryGeneratedColumn({ name: 'post_id' }) // 데이터베이스에서 실제 열 이름이 'id'일 경우
  postId: number;

  @Column({ length: 255, nullable: false })
  title: string; // NOT NULL

  @Column({ type: 'text', nullable: false })
  content: string; // NOT NULL, FULLTEXT 인덱스 가능

  @Column({ length: 255, nullable: false })
  nickname: string; // NOT NULL

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // NOT NULL, 생성 시 자동으로 설정

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date; // NOT NULL, 업데이트 시 자동으로 갱신

  @Column({ type: 'int', default: 0, nullable: true })
  views: number; // 기본값 0, NULL 허용

  @Column({ type: 'int', default: 0, nullable: true })
  commentsCount: number; // 기본값 0, NULL 허용

  @Column({ length: 255, default: 'free', nullable: false })
  category: string; // 기본값 'free', NOT NULL
}

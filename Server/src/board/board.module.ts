import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { Post } from '../entities/posts.entity';
import { Comment } from '../entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Comment])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}

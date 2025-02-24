import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/posts.entity';
import { Comment } from '../entities/comment.entity';
import { JSDOM } from 'jsdom';
import * as createDOMPurify from 'dompurify';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  public sanitizeContent(content: string): string {
    const window = new JSDOM('').window;
    const DOMPurify = createDOMPurify(window);
    return DOMPurify.sanitize(content);
  }

  async fetchBoardList(category: string, page: number): Promise<any> {
    try {
      const queryBuilder = this.postRepository.createQueryBuilder('post')
        .select([
          'post.postId',
          'post.nickname',
          'post.title',
          'post.createdAt',
          'post.views',
        ])
        .orderBy('post.postId', 'DESC')
        .skip((page - 1) * 20)
        .take(21);
  
      if (category !== 'all') {
        queryBuilder.where('post.category = :category', { category });
      }
  
      let posts = await queryBuilder.getMany();

      // 데이터 매핑
      return posts.map(post => ({
        post_id: post.postId,
        date: post.createdAt,
        title: post.title,
        writter: post.nickname,
        views: post.views,
      }));
    } catch (error) {
      console.error('Error in fetchBoardList:', error);
      throw new HttpException('Error fetching posts', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async searchBoardPosts(category: string, word: string): Promise<any> {
    try {
      const queryBuilder = this.postRepository.createQueryBuilder('post')
        .select([
          'post.postId',
          'post.nickname',
          'post.title',
          'post.createdAt',
          'post.views',
        ])
        .where('MATCH(post.content, post.title) AGAINST(:word)', { word })
        .orderBy('post.postId', 'DESC');

      if (category !== 'all') {
        queryBuilder.andWhere('post.category = :category', { category });
      }

      return await queryBuilder.getMany();
    } catch (error) {
      throw new HttpException('Error searching posts', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createPost({ title, category, content, nickname, account }: { title: string; category: string; content: string; nickname: string, account: string }) {
    try {
      const sanitizedContent = this.sanitizeContent(content);
      const post = this.postRepository.create({ title, category, content: sanitizedContent, nickname, account});
      await this.postRepository.save(post);
    } catch (error) {
      throw new HttpException('Error creating post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async modifyPost({ title, category, content, postId, nickname, account }: { title: string; category: string; content: string; postId: number; nickname: string; account:string }) {
    try {
      const post = await this.postRepository.findOne({ where: { postId: Number(postId)} });
      if (post.account !== account) {
        throw new HttpException("수정할 수 없습니다" , HttpStatus.FORBIDDEN)
      }
      if (!post) {
        throw new HttpException('포스트가 없습니다', HttpStatus.NOT_FOUND);
      }

      post.title = title;
      post.category = category;
      post.content = this.sanitizeContent(content);
      post.updatedAt = new Date();
      post.nickname = nickname
      post.account = account

      await this.postRepository.save(post);
    } catch (error) {
      throw new HttpException('포스트 수정에 실패하였습니다', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getPost(postId: number): Promise<Post> {
    try {
      const post = await this.postRepository.findOne({
        where: { postId: Number(postId) },
      });
  
      if (!post) {
        throw new HttpException(`Post with ID ${postId} not found`, HttpStatus.NOT_FOUND);
      }
  
      // 안전하게 조회수 증가
      await this.postRepository.increment({ postId: postId }, 'views', 1);
  
      // 최신 데이터 반환
      const updatedPost = await this.postRepository.findOne({
        where: { postId: Number(postId) },
      });
  
      return updatedPost as Post;
    } catch (error) {
      console.error(error);
      throw new HttpException('Error while fetching the post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  async deletePost(postId: number, account: string, admin: string[]): Promise<void> {
    try {
      
       const post = await this.postRepository.findOne({ where: { postId: Number(postId) } });
      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }

      if (admin.length === 0 && account !== post.account )
      {throw new HttpException('삭제 권한이 없습니다', HttpStatus.FORBIDDEN);}

      await this.postRepository.delete({ postId });
    } catch (error) {
      throw new HttpException('Error deleting post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addComment({ postId, nickname, content, account }: { postId: number; nickname: string; content: string; account: string; }): Promise<void> {
    try {
      const post = await this.postRepository.findOne({ where: { postId: Number(postId) } });
      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }

      const comment = this.commentRepository.create({ postId: Number(postId), account, content, nickname });
      await this.commentRepository.save(comment);
    } catch (error) {
      throw new HttpException('Error adding comment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteComment(commentId: number, account: string, admin: string[]): Promise<void> {
    try {
      const comment = await this.commentRepository.findOne({ where: { commentId: Number(commentId)} });
      
      if (!comment) {
        throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
      }

      if (admin.length === 0 && account !== comment.account )
        {throw new HttpException('삭제 권한이 없습니다', HttpStatus.FORBIDDEN);}

      await this.commentRepository.delete({ commentId });
    } catch (error) {
      throw new HttpException('Error deleting comment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async fetchCommentsByPostId(postId: number): Promise<any> {
    try {
      return await this.commentRepository.find({ where: { postId: postId } });
    } catch (error) {
      throw new HttpException('Error fetching comments', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

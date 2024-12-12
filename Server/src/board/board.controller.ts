import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Query,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { BoardService } from './board.service';
  import { User } from '../user/user.decorator';
  
  @Controller('/board')
  export class BoardController {
    constructor(private readonly boardService: BoardService) {}
  
    @Get('/list')
    async getBoardList(@Query() query: { data?: string; page?: number }) {
      const category = query.data || 'all'; // 기본값으로 'all'
      const page = Number(query.page) > 0 ? Number(query.page) : 1; // 1 이상인 페이지 번호
      try {
        const result = await this.boardService.fetchBoardList(category, page);
        if (result.length === 0) {
          throw new HttpException('No posts found', HttpStatus.NOT_FOUND);
        }
        return result;
      } catch (error) {
        console.error('Error fetching posts:', error);
        throw new HttpException(
          error.message || 'Internal Server Error',
          error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
      
    // 글 검색하기
    @Get('/search')
    async searchBoard(@Query() query: { data: string; find: string }) {
      const { data: category, find: word } = query;
      try {
        return await this.boardService.searchBoardPosts(category, word);
      } catch (error) {
        console.error('Error searching posts:', error);
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // 글 작성 및 수정
    @Post('/write')
    async writePost(
      @Body() body: { title: string; category: string; content: string; postId: string },
      @User('username') username: string, // `@User` 데코레이터 사용
    ) {
      const { title, category, content, postId } = body;
  
      if (!title || !content || !username) {
        throw new HttpException('Title, content, and username are required.', HttpStatus.BAD_REQUEST);
      }
  
      const sanitizedContent = this.boardService.sanitizeContent(content);
  
      if (postId !== 'none') {
        await this.boardService.modifyPost({
          title,
          category,
          content: sanitizedContent,
          postId: Number(postId),
          nickname: username,
        });
        console.log(title, '글 수정 완료');
      } else {
        await this.boardService.createPost({ title, category, content: sanitizedContent, nickname: username });
        console.log(title, '글 작성 완료');
      }
  
      return { message: 'Post successfully' };
    }
  
    // 게시물 보기
    @Get('/post')
    async getPost(@Query('post_id') postId: string) {
      try {
        return await this.boardService.getPost(Number(postId));
      } catch (error) {
        console.error('Error fetching post:', error);
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // 게시물 삭제
    @Delete('/delete')
    async deletePost(@Body('post_id') postId: string, @User('username') username: string) {
      try {
        await this.boardService.deletePost(Number(postId), username);
        console.log(postId, '번째 글 삭제 완료');
        return { message: 'Delete Success' };
      } catch (error) {
        console.error('Error deleting post:', error);
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // 댓글 추가
    @Post('/comment/add')
    async addComment(
      @Body() body: { post_id: string; content: string },
      @User('username') username: string,
    ) {
      const { post_id: postId, content } = body;
  
      await this.boardService.addComment({
        postId: Number(postId),
        nickname: username,
        content,
      });
  
      console.log(postId, content, '댓글 작성 완료');
      return { message: 'Add Comment Success' };
    }
  
    // 댓글 삭제
    @Delete('/comment/delete')
    async deleteComment(@Body('comment_id') commentId: string, @User('username') username: string) {
      try {
        await this.boardService.deleteComment(Number(commentId), username);
        console.log(commentId, '댓글 삭제 완료');
        return { message: 'Comment deleted successfully' };
      } catch (error) {
        console.error('Error deleting comment:', error);
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // 댓글 가져오기
    @Get('/comments')
    async getComments(@Query('post_id') postId: string) {
      try {
        return await this.boardService.fetchCommentsByPostId(Number(postId));
      } catch (error) {
        console.error('Error fetching post and comments:', error);
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  
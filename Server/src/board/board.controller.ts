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
        const result = await this.boardService.fetchBoardList(category, page);
        if (result.length === 0) {
          throw new HttpException('No posts found', HttpStatus.NOT_FOUND);
        }
        return result;
    }
      
    // 글 검색하기
    @Get('/search')
    async searchBoard(@Query() query: { data: string; find: string }) {
      const { data: category, find: word } = query;
        return await this.boardService.searchBoardPosts(category, word);
    }
  
    // 글 작성 및 수정
    @Post('/write')
    async writePost(
      @Body() body: { title: string; category: string; content: string; postId: string },
      @User() user: any, // `@User` 데코레이터 사용
    ) {
      const {username, account } = user;
      const { title, category, content, postId } = body;
  
      if (!title || !content || !username) {
        throw new HttpException('Title, content, and username are required.', HttpStatus.BAD_REQUEST);
      }
  
      const sanitizedContent = this.boardService.sanitizeContent(content);
  
 
      return postId === 'none' ? 
      await this.boardService.createPost({
        title,
        category,
        content: sanitizedContent,
        nickname: username,
        account:account }) :
      await this.boardService.modifyPost({
        title,
        category,
        content: sanitizedContent,
        postId: Number(postId),
        nickname: username,
        account: account
      });
    }
  
    // 게시물 보기
    @Get('/post')
    async getPost(@Query('post_id') postId: string) {
        return await this.boardService.getPost(Number(postId));
      }
    
  
    // 게시물 삭제
    @Delete('/delete')
    async deletePost(@Body('post_id') postId: string, @User() user: any) {
      const account = user.account
      const admin = user.admin
        console.log(postId, '번째 글 삭제 완료');
        return await this.boardService.deletePost(Number(postId), account, admin);
    }
  
    // 댓글 추가
    @Post('/comment/add')
    async addComment(
      @Body() body: { post_id: string; content: string },
      @User() user: any,
    ) {
      const { post_id: postId, content } = body;
      const { username, account} = user;
   
      console.log(postId, content, '댓글 작성');
      return await this.boardService.addComment({
        postId: Number(postId),
        nickname: username,
        account: account,
        content,
      });
    }
  
    // 댓글 삭제
    @Delete('/comment/delete')
    async deleteComment(@Body('comment_id') commentId: string, @User() user: any) {
      const {account, admin} = user
        console.log(commentId, '댓글 삭제');
        return await this.boardService.deleteComment(Number(commentId), account, admin);
        }
  
    // 댓글 가져오기
    @Get('/comments')
    async getComments(@Query('post_id') postId: string) {
        return await this.boardService.fetchCommentsByPostId(Number(postId));
    }
  }
  
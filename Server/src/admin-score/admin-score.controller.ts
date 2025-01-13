import {
    Controller,
    Post,
    Body,
    HttpException, HttpStatus,
    Delete,
  } from '@nestjs/common';
  import { AdminScoreService } from './admin-score.service'; // 서비스 파일
  import { Request as ExpressRequest } from 'express';
  import { User } from 'src/user/user.decorator';

  interface Request extends ExpressRequest {
    user?: any;
  }
  
  @Controller('admin-score')
  export class AdminScoreController {
    constructor(private readonly adminScoreService: AdminScoreService) {}
  
    // user 점수 부여
    @Post('/submit')
    async submitAdminScore(@User() user, @Body() body: { player: string; playerScore: number, mode:string }) {
  
      const { player, playerScore, mode } = body;
      console.log(`관리자의 점수 직접 부여: ${mode}에서 ${player}에게 ${playerScore}점 부여`);
      return await this.adminScoreService.updateUserScore(mode, player, playerScore, user.admin);
    }
  
    


    // b_user 랭킹 리셋
    @Delete('/reset')
    async resetRank(@User() user, @Body() body) {
      
    const prefix = body.mode.slice(0,1)
    
    console.log(body.mode , ' 계정 데이터를 초기화합니다'); 
      return       await this.adminScoreService.resetRank(
        prefix + '_user',
        prefix + '_record',
        prefix + '_temp',
        prefix + '_eventrecord',
        prefix + '_oldrecord',
        prefix + '_oldhistory',
        prefix + '_oldtournament',
        body.mode, user.admin
      );
    }
    }
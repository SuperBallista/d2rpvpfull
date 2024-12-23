import {
    Controller,
    Post,
    Body,
    Req,
    HttpException,
    HttpStatus,
    Delete,
  } from '@nestjs/common';
  import { AdminScoreService } from './admin-score.service'; // 서비스 파일
  import { Request as ExpressRequest } from 'express';
  import { START_SCORE, START_SCORE_M, START_SCORE_Z } from '../config/constants'; // 상수값
  
  interface Request extends ExpressRequest {
    user?: any;
  }
  
  @Controller('admin-score')
  export class AdminScoreController {
    constructor(private readonly adminScoreService: AdminScoreService) {}
  
    // b_user 점수 부여
    @Post('/babapk/submit')
    async submitAdminScore(@Req() req: Request, @Body() body: { player: string; playerScore: number }) {
      const userNickname = req.user['username'];
  
      if (userNickname !== 'admin') {
        throw new HttpException('권한이 없습니다.', HttpStatus.FORBIDDEN);
      }
  
      const { player, playerScore } = body;
      await this.adminScoreService.updateUserScore('babapk', player, playerScore);
      console.log(`관리자의 점수 직접 부여: ${player}에게 ${playerScore}점 부여`);
      return { message: 'Lscore update successfully' };
    }
  
    // m_user 점수 부여
    @Post('/mpk/submit')
    async submitAdminScoreM(@Req() req: Request, @Body() body: { player: string; playerScore: number }) {
      const userNickname = req.user['username'];
  
      if (userNickname !== 'admin_m') {
        throw new HttpException('권한이 없습니다.', HttpStatus.FORBIDDEN);
      }
  
      const { player, playerScore } = body;
      await this.adminScoreService.updateUserScore('mpk', `${player}_m`, playerScore);
      console.log(`관리자의 점수 직접 부여: ${player}_m 에게 ${playerScore}점 부여`);
      return { message: 'Lscore update successfully' };
    }

        // z_user 점수 부여
        @Post('/zpke/submit')
        async submitAdminScoreZ(@Req() req: Request, @Body() body: { player: string; playerScore: number }) {
          const userNickname = req.user['username'];
      
          if (userNickname !== 'admin_z') {
            throw new HttpException('권한이 없습니다.', HttpStatus.FORBIDDEN);
          }
      
          const { player, playerScore } = body;
          await this.adminScoreService.updateUserScore('zpke', `${player}_z`, playerScore);
          console.log(`관리자의 점수 직접 부여: ${player}_m 에게 ${playerScore}점 부여`);
          return { message: 'Lscore update successfully' };
        }
    


    // b_user 랭킹 리셋
    @Delete('/babapk/reset')
    async resetRank(@Req() req: Request) {
      const userNickname = req.user['username'];
  
      if (userNickname !== 'admin') {
        throw new HttpException('권한이 없습니다.', HttpStatus.FORBIDDEN);
      }
  
      await this.adminScoreService.resetRank(
        'b_user',
        'b_record',
        'b_temp',
        'b_eventrecord',
        'b_oldrecord',
        'b_oldhistory',
        'b_oldtournament',
        START_SCORE,
      );
      console.log('b_user 계정 데이터를 초기화하였습니다');
      return { success: true };
    }
  
    // m_user 랭킹 리셋
    @Delete('/mpk/reset')
    async resetRankM(@Req() req: Request) {
      const userNickname = req.user['username'];
  
      if (userNickname !== 'admin_m') {
        throw new HttpException('권한이 없습니다.', HttpStatus.FORBIDDEN);
      }
  
      await this.adminScoreService.resetRank(
        'm_user',
        'm_record',
        'm_temp',
        'm_eventrecord',
        'm_oldrecord',
        'm_oldhistory',
        'm_oldtournament',
        START_SCORE_M,
      );
      console.log('m_user 계정 데이터를 초기화하였습니다');
      return { success: true };
    }
  
  
      // b_user 랭킹 리셋
      @Delete('/zpke/reset')
      async resetRankZ(@Req() req: Request) {
        const userNickname = req.user['username'];
    
        if (userNickname !== 'admin_z') {
          throw new HttpException('권한이 없습니다.', HttpStatus.FORBIDDEN);
        }
    
        await this.adminScoreService.resetRank(
          'z_user',
          'z_record',
          'z_temp',
          'z_eventrecord',
          'z_oldrecord',
          'z_oldhistory',
          'z_oldtournament',
          START_SCORE_Z,
        );
        console.log('z_user 계정 데이터를 초기화하였습니다');
        return { success: true };
      }
    }
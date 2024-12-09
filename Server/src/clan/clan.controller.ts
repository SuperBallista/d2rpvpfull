import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    HttpException,
    HttpStatus,
    Req,
    Res,
  } from '@nestjs/common';
  import { ClanService } from './clan.service';
  import { Request, Response } from 'express';
  
  interface AuthenticatedRequest extends Request {
    user: { username: string };
  }
  
  @Controller('clan')
  export class ClanController {
    constructor(private readonly clanService: ClanService) {}
  
    @Get('list')
    async getClanList(@Res() res: Response) {
      try {
        const result = await this.clanService.clanListService();
        return res.status(200).json(result);
      } catch (error) {
        console.error('클랜 목록 출력 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Post('join')
    async joinClan(@Req() req: AuthenticatedRequest, @Body('clanname') clanname: string) {
      try {
        const userNickname = req.user['username'];
        const result = await this.clanService.clanJoinService(
          userNickname,
          clanname,
        );
  
        if (result === 'error') {
          throw new HttpException('클랜 가입 실패', HttpStatus.METHOD_NOT_ALLOWED);
        }
        return { message: '클랜 가입 성공' };
      } catch (error) {
        console.error('클랜 가입 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Post('reset')
    async resetClan(@Req() req: AuthenticatedRequest, @Body('player') player: string) {
      try {
        const userNickname = req.user['username'];
  
        if (userNickname !== 'admin_m') {
          throw new HttpException('권한이 없습니다.', HttpStatus.FORBIDDEN);
        }
  
        const result = await this.clanService.clanResetService(player + '_m');
        if (result === 'ok') {
          return { message: '클랜 리셋 완료' };
        } else {
          throw new HttpException('DB 오류', HttpStatus.BAD_REQUEST);
        }
      } catch (error) {
        console.error('클랜 리셋 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Post('score')
    async updateClanScore(
      @Req() req: AuthenticatedRequest,
      @Body('clan') clan: string,
      @Body('clanScore') clanScore: number,
    ) {
      try {
        const userNickname = req.user['username'];
        if (userNickname !== 'admin_m') {
          throw new HttpException('권한이 없습니다.', HttpStatus.FORBIDDEN);
        }
  
        const result = await this.clanService.adminClanScoreService(
          clan,
          clanScore,
        );
  
        if (result === 'ok') {
          return { message: '클랜 점수 업데이트 완료' };
        } else {
          throw new HttpException('DB 오류', HttpStatus.BAD_REQUEST);
        }
      } catch (error) {
        console.error('클랜 점수 업데이트 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
  
    @Get('record')
    async getClanRecord(@Res() res: Response) {
      try {
        const result = await this.clanService.clanRecordService();
        return res.status(200).json(result);
      } catch (error) {
        console.error('기록 조회 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Delete('record')
    async deleteClanRecord(@Req() req: AuthenticatedRequest, @Body('OrderNumber') orderNumber: number) {
      try {
        const userNickname = req.user['username'];
  
        if (userNickname !== 'admin_m') {
          throw new HttpException('권한이 없습니다.', HttpStatus.FORBIDDEN);
        }
  
        const result = await this.clanService.clanRecordDeleteService(orderNumber);
        return { message: result };
      } catch (error) {
        console.error('기록 삭제 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Post('record')
    async submitClanRecord(
      @Req() req: AuthenticatedRequest,
      @Body('winner') winner: string,
      @Body('result') result: boolean,
    ) {
      try {
        const userNickname = req.user['username'];
        const submitResult = await this.clanService.clanRecordSubmitService(
          userNickname,
          winner,
          result,
        );
  
        if (submitResult === 'ok') {
          return { message: '클랜전 기록 제출 완료' };
        } else if (submitResult === 'no clan error') {
          throw new HttpException(
            '자신 또는 상대의 소속 클랜이 없거나 잘못되었습니다',
            HttpStatus.NOT_ACCEPTABLE,
          );
        }
      } catch (error) {
        console.error('기록 제출 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Post('record/accept')
    async acceptClanRecord(
      @Body('orderNum') orderNum: number,
      @Body('result') result: string,
    ) {
      try {
        const serviceResult = await this.clanService.clanRecordAcceptService(
          orderNum,
          result,
        );
  
        if (serviceResult === 'ok') {
          return { message: '기록 승인 완료' };
        }
      } catch (error) {
        console.error('기록 승인 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Post('create')
    async createClan(@Body('clan') clan: string) {
      try {
        const result = await this.clanService.clanCreateService(clan);
  
        if (result === 'ok') {
          return { message: '클랜 생성 완료' };
        }
      } catch (error) {
        console.error('클랜 생성 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Delete('remove')
    async removeClan(@Body('clan') clan: string) {
      try {
        const result = await this.clanService.clanRemoveService(clan);
  
        if (result === 'ok') {
          return { message: '클랜 삭제 완료' };
        }
      } catch (error) {
        console.error('클랜 삭제 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  
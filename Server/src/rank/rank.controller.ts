import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { RankService } from './rank.service';
import { User } from '../user/user.decorator';

@Controller('rank')
export class RankController {
  constructor(private readonly rankingService: RankService) {}

  // b_user 랭킹 데이터 처리
  @Get('b-user')
  async getRankData() {
    try {
      return await this.rankingService.getRankDataB();
    } catch (error) {
      console.error('데이터베이스 오류:', error);
      throw new HttpException('DB Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // m_user 랭킹 데이터 처리
  @Get('m-user')
  async getRankDataM() {
    try {
      return await this.rankingService.getRankDataM();
    } catch (error) {
      console.error('데이터베이스 오류:', error);
      throw new HttpException('DB Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 도전 등록
  @Post('challenge/m-user')
  async challengeRank(
    @User() user: any,
    @Body() body: { nickname: string; mode: boolean },
  ) {
    const { nickname, mode } = body;
    try {
      await this.rankingService.challengeRank(user.username, nickname, mode);
      return { success: '도전이 성공적으로 등록되었습니다' };
    } catch (error) {
      console.error('도전 등록 오류:', error);
      throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // m_user 도전 데이터 조회
  @Get('challenge/m-user')
  async challengeDataM(@User() user: any) {
    try {
      return await this.rankingService.getChallengeData(user.username, true);
    } catch (error) {
      console.error('도전 데이터 조회 오류:', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

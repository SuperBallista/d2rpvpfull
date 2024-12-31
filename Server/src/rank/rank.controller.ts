import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { RankService } from './rank.service';
import { User } from '../user/user.decorator';

@Controller('rank')
export class RankController {
  constructor(private readonly rankingService: RankService) {}

  // b_user 랭킹 데이터 처리
  @Get('/babapk')
  async getRankData() {
    try {
      return await this.rankingService.getRankDataB();
    } catch (error) {
      console.error('데이터베이스 오류:', error);
      throw new HttpException('DB Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // m_user 랭킹 데이터 처리
  @Get('/mpk')
  async getRankDataM() {
    try {
      return await this.rankingService.getRankDataM();
    } catch (error) {
      console.error('데이터베이스 오류:', error);
      throw new HttpException('DB Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

    // m_user 랭킹 데이터 처리
    @Get('/zpke')
    async getRankDataZ() {
      try {
        return await this.rankingService.getRankDataZ();
      } catch (error) {
        console.error('데이터베이스 오류:', error);
        throw new HttpException('DB Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  


  // 도전 등록
  @Post('/challenge')
  async challengeRank(
    @User() user: any,
    @Body() body: { nickname: string; mode: string },
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
  @Post('/challenge/mpk/show')
  async challengeDataM(@User() user: any) {
    try {
    const data = await  this.rankingService.getChallengeData(user.username, "mpk");
      return data
    } catch (error) {
      return error
    }
  }

    // m_user 도전 데이터 조회
    @Post('/challenge/zpke/show')
    async challengeDataZ(@User() user: any) {
      try {
      const data = await  this.rankingService.getChallengeData(user.username, "zpke");
        return data
      } catch (error) {
        return error
      }
    }
  

}

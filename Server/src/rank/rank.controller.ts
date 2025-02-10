import { Controller, Get, Post, Body, HttpException, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { RankService } from './rank.service';
import { User } from '../user/user.decorator';
import { RolesGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/guard/roles.decorator';

@Controller('rank')
export class RankController {
  constructor(private readonly rankingService: RankService) {}



  // 메모 입력 처리
  @Patch('/memo')
    @UseGuards(RolesGuard)
    @Roles("admin", "user", "guest")
  async getRankMemo(@Body() body: {nickname: string, mode: string, memo: string}) {
    const {nickname, mode, memo} = body
    return await this.rankingService.memoModify(nickname, mode, memo);
  }

  // b_user 랭킹 데이터 처리
  @Get('/babapk')
    @UseGuards(RolesGuard)
    @Roles("admin", "user", "guest")
  async getRankData() {
      return await this.rankingService.getRankDataB();
  }

  // m_user 랭킹 데이터 처리
  @Get('/mpk')
  @UseGuards(RolesGuard)
  @Roles("admin", "user", "guest")
  async getRankDataM() {
      return await this.rankingService.getRankDataM();
  }

    // m_user 랭킹 데이터 처리
    @Get('/zpke')
    @UseGuards(RolesGuard)
    @Roles("admin", "user", "guest")
      async getRankDataZ() {
        return await this.rankingService.getRankDataZ();
    }
  


  // 도전 등록
  @Post('/challenge')
  @UseGuards(RolesGuard)
  @Roles("admin", "user")
  async challengeRank(
    @User() user: any,
    @Body() body: { nickname: string; mode: string },
  ) {
    const { nickname, mode } = body;
      await this.rankingService.challengeRank(user.username, nickname, mode);
      return { success: '도전이 성공적으로 등록되었습니다' };
  }

  // m_user 도전 데이터 조회
  @Post('/challenge/mpk/show')
  @UseGuards(RolesGuard)
  @Roles("admin", "user")
  async challengeDataM(@User() user: any) {
    const data = await  this.rankingService.getChallengeData(user.username, "mpk");
    return data
  }

    // m_user 도전 데이터 조회
    @Post('/challenge/zpke/show')
    @UseGuards(RolesGuard)
    @Roles("admin", "user")  
    async challengeDataZ(@User() user: any) {
      const data = await  this.rankingService.getChallengeData(user.username, "zpke");
        return data
    }
  

}

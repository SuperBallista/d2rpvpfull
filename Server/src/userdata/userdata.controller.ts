import {
    Controller,
    Post,
    Body,
    Delete,
  } from '@nestjs/common';
  import { UserDataService } from './userdata.service';
  import { User } from '../user/user.decorator';
  
  @Controller('/userdata')
  export class UserDataController {
    constructor(private readonly userDataService: UserDataService) {}
  
    // 사용자 정보 조회
    @Post('/info')
    async getUserDataB(@User() user: any, @Body() body: any) {
        const userData = await this.userDataService.getUserData(user.username, body.mode);
        return userData;
    }
    
    // 이메일 변경 (b_user)
    @Post('/change-email')
    async changeEmail(
      @User() user: any,
      @Body() body: { nowpw: string; newemail: string },
    ) {
        const { nowpw, newemail } = body;
        await this.userDataService.changeEmail(user.username, nowpw, newemail);
    }
  
      // 암호 변경 (b_user)
      @Post('/change-pw')
      async changePassword(
        @User() user: any,
        @Body() body: { newpw: string; nowpw: string },
      ) {
          const { nowpw, newpw } = body;
          await this.userDataService.changePassword(user.username, nowpw, newpw);
      }
      
    // 도전 취소
    @Delete('/challenge/cancel')
    async cancelChallenge(@User() user: any, @Body() body: { mode: string }) {
        const tablePrefix = body.mode.slice(0,1);
        await this.userDataService.cancelChallenge(user.username, tablePrefix);
  }
}
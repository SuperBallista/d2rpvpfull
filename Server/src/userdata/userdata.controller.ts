import {
    Controller,
    Post,
    Body,
    Delete,
    UseGuards,
  } from '@nestjs/common';
  import { UserDataService } from './userdata.service';
  import { User } from '../user/user.decorator';
import { Roles } from 'src/guard/roles.decorator';
import { RolesGuard } from 'src/guard/auth.guard';
  
  @Controller('/userdata')
    @UseGuards(RolesGuard)
    @Roles("admin", "user")
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
       return await this.userDataService.changeEmail(user.account, body.nowpw, body.newemail);
    }
  
      // 암호 변경 (b_user)
      @Post('/change-pw')
      async changePassword(
        @User() user: {account: string},
        @Body() body: { newpw: string; nowpw: string },
      ) {
          const { nowpw, newpw } = body;
         return await this.userDataService.changePassword(user.account, nowpw, newpw);
      }
      
    // 도전 취소
    @Delete('/challenge/cancel')
    async cancelChallenge(@User() user: any, @Body() body: { mode: string }) {
        const tablePrefix = body.mode.slice(0,1);
        await this.userDataService.cancelChallenge(user.username, tablePrefix);
  }
}
import {
    Controller,
    Post,
    Body,
    HttpException,
    HttpStatus,
    Delete,
  } from '@nestjs/common';
  import { UserDataService } from './userdata.service';
  import { User } from '../user/user.decorator';
  
  @Controller('userdata')
  export class UserDataController {
    constructor(private readonly userDataService: UserDataService) {}
  
    // 사용자 정보 조회 (b_user)
    @Post('/babapk/info')
    async getUserDataB(@User() user: any) {
      try {
        const userData = await this.userDataService.getUserData(user.username, 'b_user');
        if (!userData) {
          throw new HttpException('사용자를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
        }
        return userData;
      } catch (error) {
        console.error('사용자 정보 가져오기 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // 사용자 정보 조회 (m_user)
    @Post('/mpk/info')
    async getUserDataM(@User() user: any) {
      try {
        const userData = await this.userDataService.getUserData(user.username, 'm_user');
        if (!userData) {
          throw new HttpException('사용자를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
        }
        return userData;
      } catch (error) {
        console.error('사용자 정보 가져오기 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

        // 사용자 정보 조회 (b_user)
        @Post('/zpke/info')
        async getUserDataZ(@User() user: any) {
          try {
            const userData = await this.userDataService.getUserData(user.username, 'z_user');
            if (!userData) {
              throw new HttpException('사용자를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
            }
            return userData;
          } catch (error) {
            console.error('사용자 정보 가져오기 오류:', error);
            throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
          }
        }
    

  
    // 이메일 변경 (b_user)
    @Post('babapk/change-email')
    async changeEmailB(
      @User() user: any,
      @Body() body: { nowpw: string; newemail: string },
    ) {
      try {
        const { nowpw, newemail } = body;
        const result = await this.userDataService.changeEmail(user.username, nowpw, newemail, 'b_user');
        if (result.success) {
          return { message: '이메일 변경 성공' };
        } else {
          return result;
        }
      } catch (error) {
        console.error('이메일 변경 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // 이메일 변경 (m_user)
    @Post('/mpk/change-email')
    async changeEmailM(
      @User() user: any,
      @Body() body: { nowpw: string; newemail: string },
    ) {
      try {
        const { nowpw, newemail } = body;
        const result = await this.userDataService.changeEmail(user.username, nowpw, newemail, 'm_user');
        if (result.success) {
          return { message: '이메일 변경 성공' };
        } else {
          return result;
        }
      } catch (error) {
        console.error('이메일 변경 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    
    // 이메일 변경 (z_user)
    @Post('/zpke/change-email')
    async changeEmailZ(
      @User() user: any,
      @Body() body: { nowpw: string; newemail: string },
    ) {
      try {
        const { nowpw, newemail } = body;
        const result = await this.userDataService.changeEmail(user.username, nowpw, newemail, 'z_user');
        if (result.success) {
          return { message: '이메일 변경 성공' };
        } else {
          return result;
        }
      } catch (error) {
        console.error('이메일 변경 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // 비밀번호 변경 (b_user)
    @Post('/babapk/change-pw/')
    async changePasswordB(
      @User() user: any,
      @Body() body: { nowpw: string; newpw: string },
    ) {
      try {
        const { nowpw, newpw } = body;
        const result = await this.userDataService.changePassword(user.username, nowpw, newpw, 'b_user');
        if (result.success) {
          return { message: '비밀번호 변경 성공' };
        } else {
          return result;
        }
      } catch (error) {
        console.error('비밀번호 변경 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // 비밀번호 변경 (m_user)
    @Post('/mpk/change-pw/')
    async changePasswordM(
      @User() user: any,
      @Body() body: { nowpw: string; newpw: string },
    ) {
      try {
        const { nowpw, newpw } = body;
        const result = await this.userDataService.changePassword(user.username, nowpw, newpw, 'm_user');
        if (result.success) {
          return { message: '비밀번호 변경 성공' };
        } else {
          return result;
        }
      } catch (error) {
        console.error('비밀번호 변경 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  

    // 비밀번호 변경 (m_user)
    @Post('/zpke/change-pw/')
    async changePasswordZ(
      @User() user: any,
      @Body() body: { nowpw: string; newpw: string },
    ) {
      try {
        const { nowpw, newpw } = body;
        const result = await this.userDataService.changePassword(user.username, nowpw, newpw, 'z_user');
        if (result.success) {
          return { message: '비밀번호 변경 성공' };
        } else {
          return result;
        }
      } catch (error) {
        console.error('비밀번호 변경 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // 도전 취소
    @Delete('/challenge/cancel')
    async cancelChallenge(@User() user: any, @Body() body: { mode: string }) {
      try {
        const tablePrefix = body.mode.slice(0,1);
        await this.userDataService.cancelChallenge(user.username, tablePrefix);
        return { message: '도전 취소 완료' };
      } catch (error) {
        console.error('도전 취소 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }


  }
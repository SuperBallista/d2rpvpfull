import {
    Controller,
    Get,
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
    @Get('/info/b-user')
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
    @Get('/info/m-user')
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
  
    // 이메일 변경 (b_user)
    @Post('/change-email/b-user')
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
          throw new HttpException(result.error, result.status);
        }
      } catch (error) {
        console.error('이메일 변경 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // 이메일 변경 (m_user)
    @Post('/change-email/m-user')
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
          throw new HttpException(result.error, result.status);
        }
      } catch (error) {
        console.error('이메일 변경 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // 비밀번호 변경 (b_user)
    @Post('/change-pw/b-user')
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
          throw new HttpException(result.error, result.status);
        }
      } catch (error) {
        console.error('비밀번호 변경 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // 비밀번호 변경 (m_user)
    @Post('/change-pw/m-user')
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
          throw new HttpException(result.error, result.status);
        }
      } catch (error) {
        console.error('비밀번호 변경 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  

    // 도전 취소
    @Delete('/challenge/cancel')
    async cancelChallenge(@User() user: any, @Body() body: { mode: boolean }) {
      try {
        const tablePrefix = body.mode ? 'm' : 'b';
        await this.userDataService.cancelChallenge(user.username, tablePrefix);
        return { message: '도전 취소 완료' };
      } catch (error) {
        console.error('도전 취소 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }


  }
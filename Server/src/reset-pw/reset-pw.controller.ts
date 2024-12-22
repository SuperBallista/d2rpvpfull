import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ResetPasswordService } from './reset-pw.service';

@Controller('reset-pw')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  // b_user 임시 비밀번호 요청
  @Post('/babapk')
  async processEmailPw(
    @Body() body: { findpw_nickname: string; findpw_email: string },
  ): Promise<any> {
    const { findpw_nickname, findpw_email } = body;

    try {
      const result = await this.resetPasswordService.resetPassword(findpw_nickname, findpw_email, 'b_user');
      if (result.success) {
        console.log(findpw_nickname, '임시 비밀번호 요청');
        return { success: true };
      } else {
        throw new HttpException(result.error || '서버 오류', result.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      console.error('서버 오류:', error);
      throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // m_user 임시 비밀번호 요청
  @Post('/mpk')
  async processEmailPwM(
    @Body() body: { findpw_nickname: string; findpw_email: string },
  ): Promise<any> {
    let { findpw_nickname, findpw_email } = body;
    findpw_nickname += '_m'; // m_user의 닉네임은 '_m' 접미사 추가

    try {
      const result = await this.resetPasswordService.resetPassword(findpw_nickname, findpw_email, 'm_user');
      if (result.success) {
        console.log(findpw_nickname, '임시 비밀번호 요청');
        return { success: true };
      } else {
        throw new HttpException(result.error || '서버 오류', result.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      console.error('서버 오류:', error);
      throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // m_user 임시 비밀번호 요청
  @Post('/zpke')
  async processEmailPwZ(
    @Body() body: { findpw_nickname: string; findpw_email: string },
  ): Promise<any> {
    let { findpw_nickname, findpw_email } = body;
    findpw_nickname += '_z'; // m_user의 닉네임은 '_m' 접미사 추가

    try {
      const result = await this.resetPasswordService.resetPassword(findpw_nickname, findpw_email, 'z_user');
      if (result.success) {
        console.log(findpw_nickname, '임시 비밀번호 요청');
        return { success: true };
      } else {
        throw new HttpException(result.error || '서버 오류', result.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      console.error('서버 오류:', error);
      throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

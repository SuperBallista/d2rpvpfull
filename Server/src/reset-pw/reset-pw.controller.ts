import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ResetPasswordService } from './reset-pw.service';

@Controller('/reset-pw')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}


    // 통합유저 임시 비밀번호 요청
  @Post('/')
  async processEmailPw(
    @Body() body: { findpw_nickname: string; findpw_email: string },
  ): Promise<void> {
    const { findpw_nickname, findpw_email } = body;
    await this.resetPasswordService.resetPassword(findpw_nickname, findpw_email);
  }
}

import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('/auth/google')
export class GoogleAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('/callback')
  async googleAuthCallback(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      console.error('Missing required parameter: code');
      return res.redirect('/error'); // 인증 코드가 없을 때
    }

    try {
      // Google OAuth 토큰 교환
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: this.configService.get<string>('GOOGLE_CLIENT_ID'),
        client_secret: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
        redirect_uri: `${this.configService.get<string>('REDIRECT_URL')}auth/google/callback`,
        grant_type: 'authorization_code',
        code,
      });

      // 사용자 정보 요청
      const userInfo = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
      });

      const { email } = userInfo.data;

      // 사용자 정보를 DB에 저장하거나 기존 사용자 조회
      const userData = await this.authService.validateGoolge(email)
   
      // 클라이언트로 JWT 전송
        // HttpOnly 쿠키에 저장
        res.cookie('d2rpvprefreshToken', userData[1], {
            httpOnly: true, // JavaScript에서 접근 불가
            secure: this.configService.get<boolean>('HTTPS'),   // HTTPS에서만 전송
            sameSite: 'strict', // CSRF 방지
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7일 (밀리초 단위)
          });
  
        // 클라이언트에 토큰 반환
        return res.redirect("/")
      }
  
      

     catch (error) {
      console.error('OAuth Callback Error:', error.response?.data || error.message);

      // 인증 실패 시 '/error'로 리디렉션
      return res.redirect('/error');
    }
  }
}
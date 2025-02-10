import {
    Controller,
    Delete,
    Post,
    Body,
    Req,
    Res,
    HttpStatus,
    HttpCode,
    UseGuards, Get,
    HttpException,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { Response, Request as ExpressRequest, response } from 'express';
import { User } from '../user/user.decorator';
import { ConfigService } from '@nestjs/config';
import { jwtService } from 'src/jwt/jwt.service';
import { RolesGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/guard/roles.decorator';
  
  interface Request extends ExpressRequest {
    user?: any;
  }
  
  
  @Controller('/auth')
  export class AuthController {
    constructor(
      private readonly authService: AuthService,
      private readonly configService: ConfigService,
      private readonly jwtService: jwtService
    ) {}
  
    @Post('logout')
    @UseGuards(RolesGuard)
    @Roles("admin", "user")
    @HttpCode(200)
    logout(@Res({ passthrough: true }) res: Response): string {
      res.clearCookie('d2rpvprefreshToken', {
        httpOnly: true,
        secure: this.configService.get<boolean>('HTTPS'), // HTTPS 환경에서만 쿠키 전송
        sameSite: 'strict',
      });
      return '로그아웃 성공';
    }
  
    @Delete('/delete')
    @UseGuards(RolesGuard)
    @Roles('user')
    async deleteAccount(@User() user: any, @Body() body: any, @Res() res: Response) {
        const userNickname = user.account; // 인증 미들웨어로부터 사용자 정보 추출
        const { nowpw } = body;
    
           // 리프레시 토큰 쿠키 삭제
            res.clearCookie('d2rpvprefreshToken', {
              httpOnly: true,
              secure: true,
              sameSite: 'strict',
          });
     
       return await this.authService.deleteAccount(userNickname, nowpw);
    }
    
  
    @Post('/login')
    @UseGuards(RolesGuard)
    @Roles("guest", "user", "admin")
    async processLogin(@Body() body: any, @Res() res: Response) {
      // 로그인 처리
    const data = await this.authService.processLogin(body);
       
        // HttpOnly 쿠키에 저장
        res.cookie('d2rpvprefreshToken', data[1].refreshToken, {
          httpOnly: true, // JavaScript에서 접근 불가
          secure: this.configService.get<boolean>('HTTPS'),   // HTTPS에서만 전송
          sameSite: 'strict', // CSRF 방지
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7일 (밀리초 단위)
        });

      // 클라이언트에 토큰 반환
      res.status(HttpStatus.OK).json(data[0]);
    }

@Post('/register')
@UseGuards(RolesGuard)
@Roles("guest", "user", "admin")
    async processRegiU(@Body() body: any) {
      return this.authService.processRegiU(body);
    }
    
    @Post('/check-nickname')
    async processNicknameCheckU(@Body() body: any, @Res() res: Response) {
      return this.authService.processNicknameCheckU(body, res);
    }


    
    @Post('/check-jwt')
    @UseGuards(RolesGuard)
    @Roles("guest", "user", "admin")
    async checkJwt(@Req() req: Request, @Res() res: Response) {
      const token = req.cookies['d2rpvprefreshToken'];
      const decodedToken = await this.jwtService.verifyRefreshToken(token);
      const username = decodedToken? decodedToken.username : "";
      return this.authService.checkJwt(req, res, username);
    }

  }
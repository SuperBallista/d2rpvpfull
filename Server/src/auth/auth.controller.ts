import {
    Controller,
    Delete,
    Post,
    Body,
    Req,
    Res,
    HttpException,
    HttpStatus,
    HttpCode,
    UseGuards, Get
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { Response, Request as ExpressRequest } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/user.decorator';
import { ConfigService } from '@nestjs/config';
import { jwtService } from 'src/jwt/jwt.service';
  
  interface Request extends ExpressRequest {
    user?: any;
  }
  
  interface DeleteAccountResult {
    success: boolean;
    error?: string;
    status?: number;
  }
  
  @Controller('/auth')
  export class AuthController {
    constructor(
      private readonly authService: AuthService,
      private readonly configService: ConfigService,
      private readonly jwtService: jwtService
    ) {}
  
    @Post('logout')
    @HttpCode(200)
    logout(@Res({ passthrough: true }) res: Response): string {
      res.clearCookie('d2rpvprefreshToken', {
        httpOnly: true,
        secure: this.configService.get<boolean>('HTTPS'), // HTTPS 환경에서만 쿠키 전송
        sameSite: 'strict',
      });
      return '로그아웃 성공';
    }
  
    @Delete('/b-user/delete')
    async deleteAccountB(@Req() req: Request, @Res() res: Response) {
      try {
        const userNickname = req.user['username']; // 인증 미들웨어로부터 사용자 정보 추출
        const { nowpw } = req.body;
  
        const result: DeleteAccountResult = await this.authService.deleteAccount(
          userNickname,
          nowpw,
          'b_user',
        );
        if (result.success) {
          // 계정 삭제 성공 시 쿠키 삭제
          res.clearCookie('d2rpvprefreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
          });
          console.log(userNickname, '계정 삭제 성공');
          return res.json({ success: true });
        } else {
          throw new HttpException(result.error, result.status);
        }
      } catch (error) {
        console.error('계정 삭제 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Delete('/m-user/delete')
    async deleteAccountM(@Req() req: Request, @Res() res: Response) {
      try {
        const userNickname = req.user['username']; // 인증 미들웨어로부터 사용자 정보 추출
        const { nowpw } = req.body;
  
        const result: DeleteAccountResult = await this.authService.deleteAccount(
          userNickname,
          nowpw,
          'm_user',
        );
        if (result.success) {
          // 계정 삭제 성공 시 쿠키 삭제
          res.clearCookie('d2rpvprefreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
          });
          console.log(userNickname, '계정 삭제 성공');
          return res.json({ success: true });
        } else {
          throw new HttpException(result.error, result.status);
        }
      } catch (error) {
        console.error('계정 삭제 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Post('/b-user/login')
    async processLogin(@Body() body: any, @Res() res: Response) {
      // 로그인 처리
    const data = await this.authService.processLogin(body, "b_user");
       
        // HttpOnly 쿠키에 저장
        res.cookie('d2rpvprefreshToken', data.refreshToken, {
          httpOnly: true, // JavaScript에서 접근 불가
          secure: this.configService.get<boolean>('HTTPS'),   // HTTPS에서만 전송
          sameSite: 'strict', // CSRF 방지
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7일 (밀리초 단위)
        });
        console.log(data)

      // 클라이언트에 토큰 반환
      res.status(HttpStatus.OK).json({username : data.username, token: data.accessToken});
    }
  
    @Post('/m-user/login')
    async processLoginM(@Body() body: any, @Res() res: Response) {
      // 로그인 처리
    const data = await this.authService.processLogin(body, "m_user");
    
    
        // HttpOnly 쿠키에 저장
        res.cookie('d2rpvprefreshToken', data.refreshToken, {
          httpOnly: true, // JavaScript에서 접근 불가
          secure: this.configService.get<boolean>('HTTPS'),   // HTTPS에서만 전송
          sameSite: 'strict', // CSRF 방지
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7일 (밀리초 단위)
        });
  
      // 클라이언트에 토큰 반환
      res.status(HttpStatus.OK).json({username : data.username, token: data.accessToken});
    }
  

  
    @UseGuards(AuthGuard('jwt'))
    @Get('/me')
    async getProfile(@User('username') username: string) {
      return { username };
    }

    

    
    @Post('/b-user/register')
    async processRegi(@Body() body: any, @Res() res: Response) {
      return this.authService.processRegi(body, res);
    }
  
    @Post('/m-user/register')
    async processRegiM(@Body() body: any, @Res() res: Response) {
      return this.authService.processRegiM(body, res);
    }
  
    @Post('/b-user/check-nickname')
    async processNicknameCheck(@Body() body: any, @Res() res: Response) {
      return this.authService.processNicknameCheck(body, res);
    }
  
    @Post('/m-user/check-nickname')
    async processNicknameCheckM(@Body() body: any, @Res() res: Response) {
      return this.authService.processNicknameCheckM(body, res);
    }
  
    @Post('/check-jwt')
    async checkJwt(@Req() req: Request, @Res() res: Response) {
      const token = req.cookies['d2rpvprefreshToken'];
      const decodedToken = await this.jwtService.verifyRefreshToken(token);
      const username = decodedToken? decodedToken.username : "";
      return this.authService.checkJwt(req, res, username);
    }
  }
  
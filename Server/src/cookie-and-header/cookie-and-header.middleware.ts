import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, Request, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CookieAndHeaderMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // CSRF 토큰 설정
    const csrfToken = req.cookies['csrfToken'] || this.generateCsrfToken();
    if (!req.cookies['csrfToken']) {
      res.cookie('csrfToken', csrfToken, {
        httpOnly: false,
        secure: this.configService.get<boolean>('HTTPS'),
        sameSite: 'strict',
        maxAge: 3600000, // 1시간
      });
    }

    // 쿠키 및 헤더 설정
    res.setHeader('Access-Control-Expose-Headers', 'd2rpvpjwtToken');
    
    console.log('Middleware: Headers and cookies set');

    next(); // 요청 흐름을 다음으로 전달
  }

  private generateCsrfToken(): string {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }
}

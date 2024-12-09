import { Injectable, NestMiddleware } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CsrfCookieMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    let csrfToken = req.cookies['csrfToken']; // 기존 CSRF 토큰 가져오기

    if (!csrfToken) {
      // 기존 토큰이 없으면 새 토큰 생성
      csrfToken = crypto.randomBytes(32).toString('hex');
      res.cookie('csrfToken', csrfToken, {
        httpOnly: false,
        secure: false,
        sameSite: 'strict',
      });
    }

    next(); // 요청 흐름을 다음으로 전달
  }
}

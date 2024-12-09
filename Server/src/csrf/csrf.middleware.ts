import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ManualCsrfMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // GET 요청은 CSRF 검증 제외
    if (req.method === 'GET') {
      return next();
    }

    const csrfCookie = req.cookies['csrfToken']; // 쿠키에서 CSRF 토큰 가져오기
    const csrfHeader = req.headers['x-csrf-token']; // 헤더에서 CSRF 토큰 가져오기

    // 디버깅용 로그
    console.log('CSRF Cookie:', csrfCookie);
    console.log('CSRF Header:', csrfHeader);

    // CSRF 토큰 검증
    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      console.error('CSRF token validation failed');
      throw new HttpException('Invalid CSRF token', HttpStatus.FORBIDDEN);
    }

    // 검증 성공 시 다음 미들웨어로
    next();
  }
}

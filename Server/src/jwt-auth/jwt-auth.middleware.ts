import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { jwtService } from 'src/jwt/jwt.service';

interface Request extends ExpressRequest {
  user?: any;
}

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: jwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers['d2rpvpjwttoken'] as string; // 요청 헤더의 액세스 토큰
    const refreshToken = req.cookies['d2rpvprefreshToken']; // 쿠키의 리프레시 토큰

    if (accessToken) {
      try {
        // 액세스 토큰 검증
        const decoded = await this.jwtService.verifyAccessToken(accessToken);
        req.user = decoded; // 사용자 정보 설정
        return next(); // 요청 흐름 계속
      } catch (error) {
        console.warn('Invalid or expired access token:', error.message);
      }
    }

    if (refreshToken) {
      try {
        // 리프레시 토큰 검증 및 새 액세스 토큰 생성
        const decoded = await this.jwtService.verifyRefreshToken(refreshToken);
        const newAccessToken = await this.jwtService.createAccessToken(decoded.username);

        // 새 액세스 토큰을 응답 헤더에 설정
        res.setHeader('d2rpvpjwttoken', newAccessToken);
        res.setHeader('Access-Control-Expose-Headers', 'd2rpvpjwttoken');

        req.user = { username: decoded.username }; // 사용자 정보 설정
        console.log('New access token generated and set in header');
      } catch (error) {
        console.error('Invalid refresh token:', error.message);
      }
    }

    // 토큰이 없거나 유효하지 않으면 다음 단계로 진행
    if (!req.user) {
      console.warn('Unauthorized request: no valid tokens');
    }

    next();
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class jwtService {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

  // 액세스 토큰 생성
  createAccessToken(username: string): string {
    return this.jwtService.sign(
      { username }, // 페이로드
      { expiresIn: '1h', secret: this.configService.get<string>('JWT_SECRET') }, // 옵션
    );
  }

  // 리프레시 토큰 생성
  createRefreshToken(username: string): string {
    return this.jwtService.sign(
      { username }, // 페이로드
      { expiresIn: '7d', secret: this.configService.get<string>('JWT_REFRESH') }, // 리프레시 토큰 전용 비밀키


    );
  }

  // 리프레시 토큰 검증
  verifyRefreshToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH'),
      });
    } catch (error) {
      console.error('리프레시 토큰 검증 오류:', error);
      return null; // 검증 실패 시 null 반환
    }
  }

  // 엑세스 토큰 검증
  verifyAccessToken(token: string): any {
    try {
    return this.jwtService.verify(token,
      {secret: this.configService.get<string>('JWT_SECRET')});
      } catch (error) {
console.error('엑세스토큰 검증 오류: ', error);
return null
      }
  
}
}

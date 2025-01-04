import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(    private readonly configService: ConfigService,
  ) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID, // 카카오 REST API 키
      callbackURL: `${configService.get<string>('REDIRECT_URL')}/auth/kakao/callback`, // 리다이렉션 URL
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    const { id, username, _json: kakaoAccount } = profile;
    const user = {
      kakaoId: id,
      username: username || kakaoAccount.profile.nickname,
      email: kakaoAccount.email,
      accessToken,
    };
    done(null, user);
  }
}

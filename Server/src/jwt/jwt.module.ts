import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtService } from './jwt.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' }, // 기본 토큰 만료 시간
      }),
    }),
  ],
  providers: [jwtService],
  exports: [jwtService], // 다른 모듈에서 사용 가능하도록 내보냄
})
export class jwtModule {}

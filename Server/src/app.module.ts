import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AdminScoreModule } from './admin-score/admin-score.module';
import { BoardModule } from './board/board.module';
import { CalculateModule } from './calculate/calculate.module';
import { CalendarModule } from './calendar/calendar.module';
import { ClanModule } from './clan/clan.module';
import { EventModule } from './event/event.module';
import { GetNicknameModule } from './get-nickname/get-nickname.module';
import { OldRecordModule } from './old-record/old-record.module';
import { UserdataModule } from './userdata/userdata.module';
import { ResetPwModule } from './reset-pw/reset-pw.module';
import { RankModule } from './rank/rank.module';
import { RecordModule } from './record/record.module';
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { CsrfCookieMiddleware } from './csrf/csrf-cookie.middleware';
import { ManualCsrfMiddleware } from './csrf/csrf.middleware';
import * as cookieParser from 'cookie-parser';
import { JwtAuthMiddleware } from './jwt-auth/jwt-auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { jwtService } from './jwt/jwt.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 환경변수 로드
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/../**/*.entity.js'], // 엔티티 경로 수정
        synchronize: false,
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'front'), // 정적 파일 경로 수정
    }),
    CloudinaryModule,
    AdminScoreModule,
    AuthModule,
    BoardModule,
    CalculateModule,
    CalendarModule,
    ClanModule,
    EventModule,
    GetNicknameModule,
    OldRecordModule,
    UserdataModule,
    ResetPwModule,
    RankModule,
    RecordModule,
    JwtModule
  ],
  controllers: [],
  providers: [jwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser())
      .forRoutes('*');

    consumer
      .apply(CsrfCookieMiddleware)
      .forRoutes('*');

    consumer
      .apply(ManualCsrfMiddleware)
      .exclude('/auth/*') // 인증 경로 제외
      .forRoutes('*');

    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes('*');
  }
}

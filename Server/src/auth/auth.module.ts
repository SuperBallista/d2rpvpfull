import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BUser } from '../entities/b-user.entity';
import { MUser } from '../entities/m-user.entity';
import { jwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BUser, MUser]), // BUser 및 MUser 레포지토리 등록
    jwtModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], // 필요한 경우 외부 모듈에서 사용 가능하도록 내보냄
})
export class AuthModule {}

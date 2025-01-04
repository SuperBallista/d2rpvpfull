import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BUser } from '../entities/b-user.entity';
import { MUser } from '../entities/m-user.entity';
import { jwtModule } from 'src/jwt/jwt.module';
import { ZUser } from 'src/entities/z-user.entity';
import { Account } from 'src/entities/account.entity';
import { ConnectController } from './connect.controller';
import { ConnectService } from './connect.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BUser, MUser, ZUser,Account]), // BUser 및 MUser 레포지토리 등록
    jwtModule
  ],
  controllers: [ConnectController],
  providers: [ConnectService]
})
export class ConnectModule {}

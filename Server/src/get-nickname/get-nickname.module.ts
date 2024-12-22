import { Module } from '@nestjs/common';
import { NicknameController } from './get-nickname.controller';
import { NicknameService } from './get-nickname.service';
import { TypeOrmModule } from '@nestjs/typeorm';  
import { BUser } from '../entities/b-user.entity';
import { MUser } from '../entities/m-user.entity';
import { ZUser } from 'src/entities/z-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BUser, MUser,ZUser]), // 엔티티 등록
  ],
  controllers: [NicknameController],
  providers: [NicknameService]
})
export class GetNicknameModule {}

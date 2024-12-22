import { Module } from '@nestjs/common';
import { ResetPasswordController } from './reset-pw.controller';
import { ResetPasswordService } from './reset-pw.service';
import { TypeOrmModule } from '@nestjs/typeorm';        
import { BUser } from '../entities/b-user.entity';
import { MUser } from '../entities/m-user.entity';
import { ZUser } from 'src/entities/z-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BUser, MUser, ZUser]), // 엔티티 등록
  ],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService]
})
export class ResetPwModule {}

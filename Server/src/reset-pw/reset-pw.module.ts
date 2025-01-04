import { Module } from '@nestjs/common';
import { ResetPasswordController } from './reset-pw.controller';
import { ResetPasswordService } from './reset-pw.service';
import { TypeOrmModule } from '@nestjs/typeorm';        
import { Account } from 'src/entities/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]), // 엔티티 등록
  ],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService]
})
export class ResetPwModule {}

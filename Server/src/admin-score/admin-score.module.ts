import { Module } from '@nestjs/common';
import { AdminScoreService } from './admin-score.service';
import { AdminScoreController } from './admin-score.controller';
import { BUser } from '../entities/b-user.entity';
import { MUser } from '../entities/m-user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BUser, MUser])],
  providers: [AdminScoreService],
  controllers: [AdminScoreController],  
})
export class AdminScoreModule {}

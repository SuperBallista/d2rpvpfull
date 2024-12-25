import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClanService } from './clan.service';
import { ClanController } from './clan.controller';
import { BClan } from 'src/entities/b-clan.entity';
import { BUser } from 'src/entities/b-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BClan, BUser]),
  ],
  controllers: [ClanController],
  providers: [ClanService],
  exports: [ClanService],
})
export class ClanModule {}

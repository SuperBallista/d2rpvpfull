import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClanService } from './clan.service';
import { ClanController } from './clan.controller';
import { MUser } from '../entities/m-user.entity';
import { MClan } from '../entities/m-clan.entity';
import { MClanRecord } from '../entities/m-clanrecord.entity';
import { MClanRecordTemp } from '../entities/m-clanrecordtemp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MUser, MClan, MClanRecord, MClanRecordTemp]),
  ],
  controllers: [ClanController],
  providers: [ClanService],
  exports: [ClanService],
})
export class ClanModule {}

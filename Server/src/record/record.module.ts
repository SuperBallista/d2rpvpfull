import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { TypeOrmModule } from '@nestjs/typeorm';      
import { BEventRecord } from '../entities/b-eventrecord.entity';
import { BUser } from '../entities/b-user.entity';
import { MEventRecord } from '../entities/m-eventrecord.entity';
import { MUser } from '../entities/m-user.entity';
import { BTemp } from '../entities/b-temp.entity';
import { MTemp } from '../entities/m-temp.entity';
import { BRecord } from '../entities/b-record.entity';
import { MRecord } from '../entities/m-record.entity';
import { ZEventRecord } from 'src/entities/z-eventrecord.entity';
import { ZUser } from 'src/entities/z-user.entity';
import { ZTemp } from 'src/entities/z-temp.entity';
import { ZRecord } from 'src/entities/z-record.entity';
import { BClan } from 'src/entities/b-clan.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([BEventRecord, BUser, BClan, MEventRecord, MUser, ZEventRecord, ZUser, BTemp, MTemp, ZTemp, BRecord, MRecord, ZRecord]), // 엔티티 등록
  ],
  controllers: [RecordController],
  providers: [RecordService]
})
export class RecordModule {}

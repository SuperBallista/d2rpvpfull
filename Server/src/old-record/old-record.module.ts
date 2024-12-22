import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OldRecordService } from './old-record.service';
import { OldRecordController } from './old-record.controller';
import { BOldRecord } from '../entities/b-oldrecord.entity';
import { BOldHistory } from '../entities/b-oldhistory.entity';
import { MOldRecord } from '../entities/m-oldrecord.entity';
import { MOldHistory } from '../entities/m-oldhistory.entity';
import { BUser } from '../entities/b-user.entity';
import { MUser } from '../entities/m-user.entity';
import { ZOldRecord } from 'src/entities/z-oldrecord.entity';
import { ZOldHistory } from 'src/entities/z-oldhistory.entity';
import { ZUser } from 'src/entities/z-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BOldRecord,
      BOldHistory,
      MOldRecord,
      MOldHistory,
      ZOldRecord,
      ZOldHistory,
      BUser,
      MUser,
      ZUser
    ]),
  ],
  controllers: [OldRecordController],
  providers: [OldRecordService],
  exports: [OldRecordService], // 필요한 경우 외부에서 사용 가능하도록 export
})
export class OldRecordModule {}

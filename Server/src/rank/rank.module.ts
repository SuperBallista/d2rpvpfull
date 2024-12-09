import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankService } from './rank.service';
import { RankController } from './rank.controller';
import { BRecord } from '../entities/b-record.entity';
import { MRecord } from '../entities/m-record.entity';
import { BUser } from '../entities/b-user.entity';
import { MUser } from '../entities/m-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BRecord,
      MRecord,
      BUser,
      MUser,
    ]),
  ],
  controllers: [RankController],
  providers: [RankService],
  exports: [RankService], // 필요한 경우 외부에서 사용 가능하도록 export
})
export class RankModule {}

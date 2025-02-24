import { Module } from '@nestjs/common';
import { UserDataController } from './userdata.controller';
import { UserDataService } from './userdata.service';
import { TypeOrmModule } from '@nestjs/typeorm';          
import { BUser } from '../entities/b-user.entity';
import { MUser } from '../entities/m-user.entity';
import { BRecord } from '../entities/b-record.entity';
// import { MClanRecord } from '../entities/m-clanrecord.entity';
import { MRecord } from 'src/entities/m-record.entity';
import { ZUser } from 'src/entities/z-user.entity';
import { ZRecord } from 'src/entities/z-record.entity';
import { Account } from 'src/entities/account.entity';



@Module({
  imports: [
    TypeOrmModule.forFeature([BUser, MUser, ZUser, BRecord, MRecord, ZRecord, Account]), // 엔티티 등록
  ],
  controllers: [UserDataController],
  providers: [UserDataService]
})
export class UserdataModule {}

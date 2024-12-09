import { Module } from '@nestjs/common';
import { UserDataController } from './userdata.controller';
import { UserDataService } from './userdata.service';
import { TypeOrmModule } from '@nestjs/typeorm';          
import { BUser } from '../entities/b-user.entity';
import { MUser } from '../entities/m-user.entity';
import { BRecord } from '../entities/b-record.entity';
// import { MClanRecord } from '../entities/m-clanrecord.entity';
import { MRecord } from 'src/entities/m-record.entity';



@Module({
  imports: [
    TypeOrmModule.forFeature([BUser, MUser, BRecord, MRecord]), // 엔티티 등록
  ],
  controllers: [UserDataController],
  providers: [UserDataService]
})
export class UserdataModule {}

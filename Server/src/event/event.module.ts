import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';  
import { BEventRecord } from '../entities/b-eventrecord.entity';
import { BUser } from '../entities/b-user.entity';
import { MEventRecord } from '../entities/m-eventrecord.entity';
import { MUser } from '../entities/m-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BEventRecord, BUser, MEventRecord, MUser]), // 엔티티 등록
  ],
  controllers: [EventController],
  providers: [EventService]
})
export class EventModule {}

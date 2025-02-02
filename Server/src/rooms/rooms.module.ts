import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room } from '../entities/room.entity';
import { RoomAccessLog } from '../entities/roomAccessLog.entity';
import { BlockedIp } from '../entities/blockedIp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, RoomAccessLog, BlockedIp])],
  controllers: [RoomsController],
  providers: [RoomsService]
})
export class RoomsModule {}

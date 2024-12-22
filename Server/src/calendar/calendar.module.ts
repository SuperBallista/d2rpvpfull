import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { BCalendar } from '../entities/b-calendar.entity'; // 엔티티 경로 확인
import { MCalendar } from '../entities/m-calendar.entity';
import { ZCalendar } from 'src/entities/z-calendar.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([BCalendar, MCalendar, ZCalendar]), // 엔티티 등록
  ],
  controllers: [CalendarController],
  providers: [CalendarService]
})
export class CalendarModule {}

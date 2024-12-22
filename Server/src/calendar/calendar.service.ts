import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BCalendar } from '../entities/b-calendar.entity';
import { MCalendar } from '../entities/m-calendar.entity';
import { ZCalendar } from 'src/entities/z-calendar.entity';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(BCalendar)
    private readonly bCalendarRepository: Repository<BCalendar>,
    @InjectRepository(MCalendar)
    private readonly mCalendarRepository: Repository<MCalendar>,
    @InjectRepository(ZCalendar)
    private readonly zCalendarRepository: Repository<ZCalendar>,
  ) {}

  /**
   * Fetch event text based on yearmonth and mode.
   * @param yearmonth The year and month to fetch events for.
   * @param isM If true, fetch from m_calendar, otherwise from b_calendar.
   */
  async fetchEventText(yearmonth: string, mode: string): Promise<any> {
    try {
      let repository
      if (mode === "babapk"){
        repository = this.bCalendarRepository;
      } else if (mode === "mpk")
      { repository = this.mCalendarRepository;
      } else if (mode === "zpke")
      { repository = this.zCalendarRepository;
      }


      const data = await repository.find({
        where: { yearmonth },
        select: ['text', 'date'],
    });
    console.log('Fetched Data:', data);
      return data;
      
    } catch (error) {
      console.error('Error fetching event text:', error);
      throw new HttpException('Failed to fetch event text', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
  }

  /**
   * Save or update event text in the specified table.
   * @param eventData The event data to save.
   * @param isM If true, save to m_calendar, otherwise to b_calendar.
   */
  async saveEventText(
    { yearmonth, yearmonthdate, date, text }: { yearmonth: string; yearmonthdate: string; date: number; text: string },
    mode: string,
  ): Promise<void> {
    try {
      let repository
      if (mode === "babapk"){
        repository = this.bCalendarRepository;
      } else if (mode === "mpk")
      { repository = this.mCalendarRepository;
      } else if (mode === "zpke")
      { repository = this.zCalendarRepository;
      }

      // Check if event already exists for the given yearmonthdate
      const existingEvent = await repository.findOne({ where: { yearmonthdate } });

      if (existingEvent) {
        // Update existing event
        existingEvent.text = text;
        existingEvent.date = date;
        await repository.save(existingEvent);
      } else {
        // Create new event
        const newEvent = repository.create({ yearmonth, yearmonthdate, date, text });
        await repository.save(newEvent);
      }
    } catch (error) {
      console.error('Error saving event text:', error);
      throw new HttpException('Failed to save event text', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

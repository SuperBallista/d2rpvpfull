import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('/event')
  async getEventText(@Query() query: { year: string; month: string; mode: string }) {
    const yearmonth = String(query.year) + String(query.month).padStart(2, '0');
    return await this.calendarService.fetchEventText(yearmonth, query.mode);
  }

  @Post('/event')
  async changeEventText(
    @Body() body: { year: string; month: string; day: string; event: string; mode: string },
  ) {
    const yearmonth = String(body.year) + String(body.month).padStart(2, '0');
    const yearmonthdate = yearmonth + String(body.day).padStart(2, '0');
    const mode = body.mode;
    return  await this.calendarService.saveEventText({ yearmonth, yearmonthdate, date: Number(body.day), text: body.event },
      mode);
}
}
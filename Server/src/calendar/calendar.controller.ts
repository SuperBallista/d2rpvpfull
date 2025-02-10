import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { RolesGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/guard/roles.decorator';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('/event')
  @UseGuards(RolesGuard)
  @Roles("admin", "user", "guest")
  async getEventText(@Query() query: { year: string; month: string; mode: string }) {
    const yearmonth = String(query.year) + String(query.month).padStart(2, '0');
    return await this.calendarService.fetchEventText(yearmonth, query.mode);
  }

  @Post('/event')
  @UseGuards(RolesGuard)
  @Roles("admin")
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
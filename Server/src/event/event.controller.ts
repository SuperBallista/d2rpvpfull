import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { EventService } from './event.service';
import { User } from '../user/user.decorator';

@Controller('/event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('/submit')
  async submitUserEvent(@Body() eventdata: object) {
      await this.eventService.submitEvent(eventdata);
  }

  @Get('/history')
  async getUserEventHistory(@Query('mode') mode: string) {
      return await this.eventService.getEventHistory(mode);
  }

  @Delete('/delete')
  async deleteUserEvent(
    @Body() body: any,
    @User() user: any,
  ) {
      await this.eventService.deleteEvent(body.event, body.mode, user.admin);
  }

  @Post('/accept')
  async acceptBUserEvent(@User() user, @Body() body: any) {
      await this.eventService.acceptEvent(body.event, body.mode, user.admin);
  }

  @Patch('/memo')
  async modifyMemo(@Body() memoData: any, @User() user: any){
      await this.eventService.modifyMemo(memoData, user.admin)
    }


  @Delete('/cancel')
  async cancelBUserAcceptedEvent(
    @Body() body: any,
    @User() user: any,
  ) {
      await this.eventService.cancelAccepted(body.event, body.mode, user.admin);
  }

}

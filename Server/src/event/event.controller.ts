import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { User } from '../user/user.decorator';
import { RolesGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/guard/roles.decorator';

@Controller('/event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('/submit')
    @UseGuards(RolesGuard)
    @Roles("admin", "user")
  async submitUserEvent(@Body() eventdata: object) {
      await this.eventService.submitEvent(eventdata);
  }

  @Get('/history')
  @UseGuards(RolesGuard)
  @Roles("admin", "user", "guest")
  async getUserEventHistory(@Query('mode') mode: string) {
      return await this.eventService.getEventHistory(mode);
  }

  @Delete('/delete')
  @UseGuards(RolesGuard)
  @Roles("admin")
  async deleteUserEvent(
    @Body() body: any,
    @User() user: any,
  ) {
      await this.eventService.deleteEvent(body.event, body.mode);
  }

  @Post('/accept')
  @UseGuards(RolesGuard)
  @Roles("admin")
  async acceptBUserEvent(@User() user, @Body() body: any) {
      await this.eventService.acceptEvent(body.event, body.mode);
  }

  @Patch('/memo')
  @UseGuards(RolesGuard)
  @Roles("admin")
  async modifyMemo(@Body() memoData: any, @User() user: any){
      await this.eventService.modifyMemo(memoData)
    }


  @Delete('/cancel')
  @UseGuards(RolesGuard)
  @Roles("admin")
  async cancelBUserAcceptedEvent(
    @Body() body: any,
    @User() user: any,
  ) {
      await this.eventService.cancelAccepted(body.event, body.mode);
  }

}

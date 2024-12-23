import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  HttpException,
  HttpStatus,
  Put,
  Patch,
} from '@nestjs/common';
import { EventService } from './event.service';
import { User } from '../user/user.decorator';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('/babapk/submit')
  async submitBUserEvent(@Body() eventdata: object) {
    try {
      await this.eventService.submitEvent(eventdata, "babapk");
      console.log(eventdata, 'Barbarian tournament record submitted successfully.');
      return { message: 'Tournament record submitted successfully.' };
    } catch (error) {
      console.error('Error submitting record:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/mpk/submit')
  async submitMUserEvent(@Body() eventdata: object) {
    try {
      await this.eventService.submitEvent(eventdata, "mpk");
      console.log(eventdata, 'Melee tournament record submitted successfully.');
      return { message: 'Tournament record submitted successfully.' };
    } catch (error) {
      console.error('Error submitting record:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/zpke/submit')
  async submitZUserEvent(@Body() eventdata: object) {
    try {
      await this.eventService.submitEvent(eventdata, "zpke");
      console.log(eventdata, 'Zealot tournament record submitted successfully.');
      return { message: 'Tournament record submitted successfully.' };
    } catch (error) {
      console.error('Error submitting record:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  @Get('/babapk/history')
  async getBUserEventHistory() {
    try {
      return await this.eventService.getEventHistory("babapk");
    } catch (error) {
      console.error('Error fetching Barbarian tournament history:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/mpk/history')
  async getMUserEventHistory() {
    try {
      return await this.eventService.getEventHistory("mpk");
    } catch (error) {
      console.error('Error fetching Melee tournament history:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/zpke/history')
  async getZUserEventHistory() {
    try {
      return await this.eventService.getEventHistory("zpke");
    } catch (error) {
      console.error('Error fetching Zealot tournament history:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



  @Delete('/babapk/delete')
  async deleteBUserEvent(
    @Body('eventname') eventname: string,
    @User('username') username: string,
  ) {
    try {
      if (!eventname) {
        throw new HttpException('Invalid event name.', HttpStatus.BAD_REQUEST);
      }

      if (!['admin', 'admin_m', 'admin_z'].includes(username)) {
        throw new HttpException('Unauthorized.', HttpStatus.FORBIDDEN);
      }

      await this.eventService.deleteEvent(eventname, "babapk");
      console.log(eventname, 'Barbarian tournament deleted.');
      return { message: 'Tournament record deleted successfully.' };
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/mpk/delete')
  async deleteMUserEvent(
    @Body('eventname') eventname: string,
    @User('username') username: string,
  ) {
    try {
      if (!eventname) {
        throw new HttpException('Invalid event name.', HttpStatus.BAD_REQUEST);
      }

      if (!['admin', 'admin_m', 'admin_z'].includes(username)) {
        throw new HttpException('Unauthorized.', HttpStatus.FORBIDDEN);
      }

      await this.eventService.deleteEvent(eventname, "mpk");
      console.log(eventname, 'Melee tournament deleted.');
      return { message: 'Tournament record deleted successfully.' };
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/zpke/delete')
  async deleteZUserEvent(
    @Body('eventname') eventname: string,
    @User('username') username: string,
  ) {
    try {
      if (!eventname) {
        throw new HttpException('Invalid event name.', HttpStatus.BAD_REQUEST);
      }

      if (!['admin', 'admin_m', 'admin_z'].includes(username)) {
        throw new HttpException('Unauthorized.', HttpStatus.FORBIDDEN);
      }

      await this.eventService.deleteEvent(eventname, "zpke");
      console.log(eventname, 'Melee tournament deleted.');
      return { message: 'Tournament record deleted successfully.' };
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  @Post('/babapk/accept')
  async acceptBUserEvent(@Body() eventdata: any) {
    try {
      await this.eventService.acceptEvent(eventdata, "babapk");
      console.log(eventdata, 'Barbarian tournament approved.');
      return { message: 'Tournament approved successfully.' };
    } catch (error) {
      console.error('Error approving event:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/mpk/accept')
  async acceptMUserEvent(@Body() eventdata: any) {
    try {
      await this.eventService.acceptEvent(eventdata, "mpk");
      console.log(eventdata, 'Melee tournament approved.');
      return { message: 'Tournament approved successfully.' };
    } catch (error) {
      console.error('Error approving event:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/zpke/accept')
  async acceptZUserEvent(@Body() eventdata: any) {
    try {
      await this.eventService.acceptEvent(eventdata, "zpke");
      console.log(eventdata, 'Zealot tournament approved.');
      return { message: 'Tournament approved successfully.' };
    } catch (error) {
      console.error('Error approving event:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('/memo')
  async modifyMemo(@Body() memoData: any, @User() user: any){
      if (user.username != "admin" && user.username != "admin_m" && user.username != "admin_z")
    {
      throw new HttpException(
        '권한 없음',
        HttpStatus.FORBIDDEN,
      )
    }
      try{
      await this.eventService.modifyMemo(memoData)
      return {success: true};
      }
      catch (error) {
        console.error('Error modifying memo event:', error);
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
  }







  @Delete('/babapk/cancel')
  async cancelBUserAcceptedEvent(
    @Body() eventdata: any,
    @User('username') username: string,
  ) {
    try {
      if (!['admin', 'admin_m','admin_z'].includes(username)) {
        throw new HttpException('Unauthorized.', HttpStatus.FORBIDDEN);
      }

      await this.eventService.cancelAccepted(eventdata, "babapk");
      console.log(eventdata.eventname, 'Barbarian tournament canceled.');
      return {
        message:
          'Approved tournament record canceled and scores reverted successfully.',
      };
    } catch (error) {
      console.error('Error canceling approved event:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/mpk/cancel')
  async cancelMUserAcceptedEvent(
    @Body() eventdata: any,
    @User('username') username: string,
  ) {
    try {
      if (!['admin', 'admin_m','admin_z'].includes(username)) {
        throw new HttpException('Unauthorized.', HttpStatus.FORBIDDEN);
      }

      await this.eventService.cancelAccepted(eventdata, "mpk");
      console.log(eventdata.eventname, 'Melee tournament canceled.');
      return {
        message:
          'Approved tournament record canceled and scores reverted successfully.',
      };
    } catch (error) {
      console.error('Error canceling approved event:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/zpke/cancel')
  async cancelZUserAcceptedEvent(
    @Body() eventdata: any,
    @User('username') username: string,
  ) {
    try {
      if (!['admin', 'admin_m','admin_z'].includes(username)) {
        throw new HttpException('Unauthorized.', HttpStatus.FORBIDDEN);
      }

      await this.eventService.cancelAccepted(eventdata, "zpke");
      console.log(eventdata.eventname, 'Zealot tournament canceled.');
      return {
        message:
          'Approved tournament record canceled and scores reverted successfully.',
      };
    } catch (error) {
      console.error('Error canceling approved event:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }




}

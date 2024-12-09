import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EventService } from './event.service';
import { User } from '../user/user.decorator';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('/b-user/submit')
  async submitBUserEvent(@Body() eventdata: object) {
    try {
      await this.eventService.submitEvent(eventdata, false);
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

  @Post('/m-user/submit')
  async submitMUserEvent(@Body() eventdata: object) {
    try {
      await this.eventService.submitEvent(eventdata, true);
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

  @Get('/b-user/history')
  async getBUserEventHistory() {
    try {
      return await this.eventService.getEventHistory(false);
    } catch (error) {
      console.error('Error fetching Barbarian tournament history:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/m-user/history')
  async getMUserEventHistory() {
    try {
      return await this.eventService.getEventHistory(true);
    } catch (error) {
      console.error('Error fetching Melee tournament history:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/b-user/delete')
  async deleteBUserEvent(
    @Body('eventname') eventname: string,
    @User('username') username: string,
  ) {
    try {
      if (!eventname) {
        throw new HttpException('Invalid event name.', HttpStatus.BAD_REQUEST);
      }

      if (!['admin', 'admin_m'].includes(username)) {
        throw new HttpException('Unauthorized.', HttpStatus.FORBIDDEN);
      }

      await this.eventService.deleteEvent(eventname, false);
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

  @Delete('/m-user/delete')
  async deleteMUserEvent(
    @Body('eventname') eventname: string,
    @User('username') username: string,
  ) {
    try {
      if (!eventname) {
        throw new HttpException('Invalid event name.', HttpStatus.BAD_REQUEST);
      }

      if (!['admin', 'admin_m'].includes(username)) {
        throw new HttpException('Unauthorized.', HttpStatus.FORBIDDEN);
      }

      await this.eventService.deleteEvent(eventname, true);
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

  @Post('/b-user/accept')
  async acceptBUserEvent(@Body() eventdata: any) {
    try {
      await this.eventService.acceptEvent(eventdata, false);
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

  @Post('/m-user/accept')
  async acceptMUserEvent(@Body() eventdata: any) {
    try {
      await this.eventService.acceptEvent(eventdata, true);
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

  @Delete('/b-user/cancel')
  async cancelBUserAcceptedEvent(
    @Body() eventdata: any,
    @User('username') username: string,
  ) {
    try {
      if (!['admin', 'admin_m'].includes(username)) {
        throw new HttpException('Unauthorized.', HttpStatus.FORBIDDEN);
      }

      await this.eventService.cancelAccepted(eventdata, false);
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

  @Delete('/m-user/cancel')
  async cancelMUserAcceptedEvent(
    @Body() eventdata: any,
    @User('username') username: string,
  ) {
    try {
      if (!['admin', 'admin_m'].includes(username)) {
        throw new HttpException('Unauthorized.', HttpStatus.FORBIDDEN);
      }

      await this.eventService.cancelAccepted(eventdata, true);
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
}

import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { OldRecordService } from './old-record.service';

@Controller('old-records')
export class OldRecordController {
  constructor(private readonly oldRecordService: OldRecordService) {}

  @Get('records/b-user')
  async loadOldRecord() {
    try {
      return await this.oldRecordService.fetchOldRecords(false);
    } catch (error) {
      console.error('Error fetching old records for b_user:', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('records/m-user')
  async loadOldRecordM() {
    try {
      return await this.oldRecordService.fetchOldRecords(true);
    } catch (error) {
      console.error('Error fetching old records for m_user:', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('history/b-user')
  async loadOldHistory() {
    try {
      return await this.oldRecordService.fetchOldHistory(false);
    } catch (error) {
      console.error('Error fetching old history for b_user:', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('history/m-user')
  async loadOldHistoryM() {
    try {
      return await this.oldRecordService.fetchOldHistory(true);
    } catch (error) {
      console.error('Error fetching old history for m_user:', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('rank/b-user')
  async loadRankScore() {
    try {
      return await this.oldRecordService.fetchRankData(false);
    } catch (error) {
      console.error('Error fetching rank data for b_user:', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('rank/m-user')
  async loadRankScoreM() {
    try {
      return await this.oldRecordService.fetchRankData(true);
    } catch (error) {
      console.error('Error fetching rank data for m_user:', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

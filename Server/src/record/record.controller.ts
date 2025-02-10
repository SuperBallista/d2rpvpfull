import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { RecordService } from './record.service';
  import { User } from '../user/user.decorator';
import { RolesGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/guard/roles.decorator';
  
  @Controller('record')
  export class RecordController {
    constructor(private readonly recordService: RecordService) {}
  
    @Post('/submit')
      @UseGuards(RolesGuard)
      @Roles("admin", "user")
    async submitRecord(
      @User() user: any,
      @Body() body: { winner: string; mode: string },
    ):Promise<void> {
        await this.recordService.submitRecord(body.winner, body.mode, user.username);
    }
  
    @Post('/approve')
    @UseGuards(RolesGuard)
    @Roles("admin", "user")
      async approveRecord(@Body() body: { orderNum: number; mode: string }) {
        await this.recordService.approveRecord(body.orderNum, body.mode);
    }

    @Delete("/cancel")
    @UseGuards(RolesGuard)
    @Roles("admin", "user")  
   async cancelRecord(@Body() body: { orderNum: number; mode: string }) {
        await this.recordService.cancelRecord(body.orderNum, body.mode);
    }  

    @Delete('/delete')
    @UseGuards(RolesGuard)
    @Roles("admin")  
    async deleteRecord(
      @User() user: any,
      @Body() body: { OrderNum: number; mode: string },)
      {        await this.recordService.deleteRecord(body.OrderNum, body.mode);
    }
  
    @Get('/data')
    @UseGuards(RolesGuard)
    @Roles("admin", "user", "guest")  
    async getRecordData(@Query('mode') mode: string) {
        const records = await this.recordService.fetchRecordData(mode);
        return records;
    }
  
    @Post('/pending')
    @UseGuards(RolesGuard)
    @Roles("admin", "user")  
    async getPendingRecords(@User() user: any, @Body() body : {mode:string}) {
        const data = await this.recordService.fetchPendingRecords(user.username, body.mode);
        return data;
    }
  
    @Post('/challenge/lose')
    @UseGuards(RolesGuard)
    @Roles("admin", "user")  
    async challengeLose(
      @User() user: any,
      @Body() body: { challenger: string; mode: string }) {
        const tableMode = body.mode.slice(0,1); // boolean -> string 변환
        const loser = user.username;
        await this.recordService.challengeLose(tableMode, body.challenger, loser);
    }
  
    @Post('/challenge/win')
    @UseGuards(RolesGuard)
    @Roles("admin", "user")  
    async challengeWin(
      @Body() body: { challenger: string; mode: string },
    ) {
        const tableMode = body.mode.slice(0,1); // boolean -> string 변환
        await this.recordService.challengeWin(tableMode, body.challenger);
    }
      // 도전 체크
      @Post('/challenge/check')
      @UseGuards(RolesGuard)
      @Roles("admin", "user")    
      async checkChallenge(
        @User() user: any,
        @Body() body: { mode: string; challenge: string },
      ) {
          const tablePrefix = body.mode.slice(0,1);
          await this.recordService.checkChallenge(
            user.username,
            body.challenge,
            tablePrefix,
          );
           await this.recordService.challengeLose(tablePrefix, user.username, body.challenge)}
      }
      
  
  
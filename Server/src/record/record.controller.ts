import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Query,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { RecordService } from './record.service';
  import { User } from '../user/user.decorator';
  
  @Controller('record')
  export class RecordController {
    constructor(private readonly recordService: RecordService) {}
  
    @Post('/submit')
    async submitRecord(
      @User() user: any,
      @Body() body: { winner: string; mode: string },
    ) {
      try {
        const { winner, mode } = body;
        if (!winner) {
          throw new HttpException('Invalid Data', HttpStatus.BAD_REQUEST);
        }
        const userNickname = user.username;
        await this.recordService.submitRecord(winner, mode, userNickname);
        console.log(`${userNickname} submitted a record for ${winner}`);
        return { message: 'Record submitted successfully' };
      } catch (error) {
        console.error('Error submitting record:', error);
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Post('/approve')
    async approveRecord(@Body() body: { orderNum: number; mode: string }) {
      try {
        const { orderNum, mode } = body;
        if (!orderNum || mode === undefined) {
          throw new HttpException('Invalid Data', HttpStatus.BAD_REQUEST);
        }
        await this.recordService.approveRecord(orderNum, mode);
        console.log(`Record ${orderNum} approved`);
        return { message: 'Record approved successfully' };
      } catch (error) {
        console.error('Error approving record:', error);
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    @Delete("/cancel")
   async cancelRecord(@Body() body: { orderNum: number; mode: string }) {
      try {
        const { orderNum, mode } = body;
        if (!orderNum || mode === undefined) {
          throw new HttpException('Invalid Data', HttpStatus.BAD_REQUEST);
        }
        await this.recordService.cancelRecord(orderNum, mode);
        console.log(`Record ${orderNum} cancel`);
        return { message: 'Record canceled successfully' };
      } catch (error) {
        console.error('Error approving record:', error);
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }  
    @Delete('/delete')
    async deleteRecord(
      @User() user: any,
      @Body() body: { OrderNum: number; mode: string },
    ) {
      try {
        const { OrderNum, mode } = body;
        if (!OrderNum) {
          throw new HttpException('Invalid OrderNum', HttpStatus.BAD_REQUEST);
        }
        const userNickname = user.username;
        if (userNickname !== 'admin' && userNickname !== 'admin_m' && userNickname !== 'admin_z') {
          throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
        }
        await this.recordService.deleteRecord(OrderNum, mode, userNickname);
        console.log(`Record ${OrderNum} deleted by ${userNickname}`);
        return { message: 'Record deleted successfully' };
      } catch (error) {
        console.error('Error deleting record:', error);
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Get('/data')
    async getRecordData(@Query('mode') mode: string) {
      try {
        const records = await this.recordService.fetchRecordData(mode);
        return records;
      } catch (error) {
        console.error('Error fetching record data:', error);
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Post('/pending')
    async getPendingRecords(@User() user: any, @Body() body : {mode:string}) {
      const mode = body.mode;
      try {
        const userNickname = user.username;
        const data = await this.recordService.fetchPendingRecords(userNickname, mode);
        return data;
      } catch (error) {
        console.error('Error fetching pending records:', error);
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Post('/challenge/lose')
    async challengeLose(
      @User() user: any,
      @Body() body: { challenger: string; mode: boolean },
    ) {
      try {
        const { challenger, mode } = body;
        const tableMode = mode ? 'm' : 'b'; // boolean -> string 변환
        const loser = user.username;
        await this.recordService.challengeLose(tableMode, challenger, loser);
        console.log(`Challenge lost: ${loser} lost to ${challenger}`);
        return { message: 'Challenge recorded successfully' };
      } catch (error) {
        console.error('Error recording challenge lose:', error);
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Post('/challenge/win')
    async challengeWin(
      @User() user: any,
      @Body() body: { challenger: string; mode: boolean },
    ) {
      try {
        const { challenger, mode } = body;
        const tableMode = mode ? 'm' : 'b'; // boolean -> string 변환
        await this.recordService.challengeWin(tableMode, challenger);
        console.log(`Challenge won by ${challenger}, recorded by ${user.username}`);
        return { message: 'Challenge win recorded successfully' };
      } catch (error) {
        console.error('Error recording challenge win:', error);
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
      // 도전 체크
      @Post('/challenge/check')
      async checkChallenge(
        @User() user: any,
        @Body() body: { mode: boolean; challenge: string },
      ) {
        try {
          const tablePrefix = body.mode ? 'm' : 'b';
          const check = await this.recordService.checkChallenge(
            user.username,
            body.challenge,
            tablePrefix,
          );
          let result
          if (check==="ok")
{          result = await this.recordService.challengeLose(tablePrefix, user.username, body.challenge)
} else {
            // 예상치 못한 오류만 처리
            console.error('기록 도중 오류가 발생하였습니다');
            throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);


  
}
          return { message: "자동 승리가 기록되었습니다"} ;
        } catch (error) {
          if (error instanceof HttpException) {
            // 서비스에서 발생한 HttpException 그대로 전달
            throw error;
          }
      
          // 예상치 못한 오류만 처리
          console.error('도전 확인 오류:', error);
          throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
      
    }
  
  
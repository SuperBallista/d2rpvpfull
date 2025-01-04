import { Controller, Body, Post, Res, Req, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConnectService } from './connect.service';
import { User } from '../user/user.decorator';
import { Response, Request as ExpressRequest } from 'express';

interface Request extends ExpressRequest {
  user?: any;
}
interface DeleteAccountResult {
  success: boolean;
  error?: string;
  status?: number;
}


@Controller('connect')
export class ConnectController {
    constructor(
        private readonly ConnectService: ConnectService,
        private readonly configService: ConfigService,
      ) {}
  
    @Post('/login')
    async processLogin(@Body() body: any, @User() user: any) {
      const userNickname = user.account
      if (userNickname === "badmin" || userNickname === "madmin" || userNickname === "zadmin")
        {throw new HttpException("관리자 계정은 수정이 불가능합니다", HttpStatus.FORBIDDEN)}
  

      // 로그인 처리
    const data = await this.ConnectService.processLogin(body, user.account);
    return data
    }


    
    @Post('/new')
    async processRegi(@Body() body: any, @Res() res: Response, @User() user: any) {
      const userNickname = user.account
      if (userNickname === "badmin" || userNickname === "madmin" || userNickname === "zadmin")
        {throw new HttpException("관리자 계정은 수정이 불가능합니다", HttpStatus.FORBIDDEN)}
  

      return this.ConnectService.processNew(body, res, user.account);
    }
  
    @Delete('/delete')
    async deleteAccountChar(@Req() req: Request, @Res() res: Response, @User() user: any) {
      try {
        const userNickname = user.account; // 인증 미들웨어로부터 사용자 정보 추출
        const { mode, nickname } = req.body;

        if (userNickname === "badmin" || userNickname === "madmin" || userNickname === "zadmin")
        {throw new HttpException("관리자 계정은 삭제가 불가능합니다", HttpStatus.FORBIDDEN)}
  
        const result: DeleteAccountResult = await this.ConnectService.deleteCharactor(
          userNickname,
          nickname,
          mode
        );

        if (result.success) {
          // 계정 삭제 성공 시 쿠키 삭제
          console.log(userNickname, mode,'캐릭터 삭제 성공');
          return res.json({ success: true });

        } else {
          throw new HttpException(result.error, result.status);
        }
      } catch (error) {
        console.error('계정 삭제 오류:', error);
        throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }





}

import { Controller, Body, Post, Delete, UseGuards } from '@nestjs/common';
import { ConnectService } from './connect.service';
import { User } from '../user/user.decorator';
import { RolesGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/guard/roles.decorator';


@Controller('connect')
  @UseGuards(RolesGuard)
  @Roles("admin", "user")
export class ConnectController {
    constructor(
        private readonly ConnectService: ConnectService,
      ) {}
  
    @Post('/login')
    async processLogin(@Body() body: any, @User() user: any) {
    return await this.ConnectService.processLogin(body, user.account);
    }


    
    @Post('/new')
    async processRegi(@Body() body: any, @User() user: any) {
      return this.ConnectService.processNew(body, user.account);
    }
  
    @Delete('/delete')
    async deleteAccountChar(@Body() body: any, @User() user: any) {
        const { mode, nickname } = body;
         await this.ConnectService.deleteCharactor(
          user.account,
          nickname,
          mode
        );
          console.log(user.account, mode,'캐릭터 삭제');
    }

}

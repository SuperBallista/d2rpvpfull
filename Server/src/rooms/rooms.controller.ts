import { Controller, Get, Post, Param, Req, NotFoundException, Body } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { User } from 'src/user/user.decorator';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  async getLatestRooms() {
    return await this.roomsService.getLatestRooms();
  }

  @Post('/password')
  async getRoomPassword(@Body("id") id: number, @Req() request: Request, @User() user: any) {
    const userIp = request.headers['x-forwarded-for'] || "local"
    const userAccount = user.account

    const room = await this.roomsService.getRoomPassword(id);
    if (!room) throw new NotFoundException('방을 찾을 수 없습니다.');

    await this.roomsService.logRoomAccess(id, userAccount, userIp);
    return { room_name: room.room_name, password: room.password };
  }

  @Post("/views")
  async getRoomViews(@Body("id") id: number){
   
   return await this.roomsService.viewsRoomAccess(id);
  }

  @Post("/new")
  async makeNewRoom(@Body() body: any){
    return this.roomsService.makeNewRoom(body);
  }



}
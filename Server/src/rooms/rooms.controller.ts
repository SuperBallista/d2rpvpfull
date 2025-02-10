import { Controller, Get, Post, Param, Req, NotFoundException, Body, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { User } from 'src/user/user.decorator';
import { RolesGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/guard/roles.decorator';

@Controller('/rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
    @UseGuards(RolesGuard)
    @Roles("admin", "user")
  async getLatestRooms() {
    return await this.roomsService.getLatestRooms();
  }

  @Post('/password')
  @UseGuards(RolesGuard)
  @Roles("admin", "user")
  async getRoomPassword(@Body("id") id: number, @Req() request: Request, @User() user: any) {
    const userIp = request.headers['x-forwarded-for'] || "local"
    const userAccount = user.account

    const room = await this.roomsService.getRoomPassword(id);
    if (!room) throw new NotFoundException('방을 찾을 수 없습니다.');

    await this.roomsService.logRoomAccess(id, userAccount, userIp);
    return { room_name: room.room_name, password: room.password };
  }

  @Post("/views")
  @UseGuards(RolesGuard)
  @Roles("admin", "user")
  async getRoomViews(@Body("id") id: number){
   
   return await this.roomsService.viewsRoomAccess(id);
  }

  @Post("/new")
  @UseGuards(RolesGuard)
  @Roles("admin", "user")
  async makeNewRoom(@Body() body: any, @Req() request: Request, @User() user: any){
    return this.roomsService.makeNewRoom(body, user.account, request.headers['x-forwarded-for'] || "local");
  }



}
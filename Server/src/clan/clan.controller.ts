import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Req,
    Patch,
  } from '@nestjs/common';
  import { ClanService } from './clan.service';
import { User } from 'src/user/user.decorator';
  
  
  @Controller('clan')
  export class ClanController {
    constructor(private readonly clanService: ClanService) {}
  
    @Get('/babapk/list')
    async getClanList() {
        const result = await this.clanService.clanListService();
        return result;
    }

    @Post('/babapk/myclan')
    async getMyClan(@User() user:any){
      return await this.clanService.getMyClanService(user.username);
    }
  
    @Patch('/babapk/join')
    async joinClan(@Body('clanname') clanname: string, @User() user:any) {
        return await this.clanService.clanJoinService(
          user.username,
          clanname,
        );
    }
  
    @Post('/babapk/reset')
    async resetClan(@Req() @User() user: any, @Body('player') player: string) {     
        return await this.clanService.clanResetService(player, user.admin);
    }
  
    @Post('/babapk/score')
    async updateClanScore(
      @User() user: any,
      @Body('clan') clan: string,
      @Body('clanScore') clanScore: number,
    ) { 
        return await this.clanService.adminClanScoreService(
          clan,
          clanScore,
          user.admin
        );
  
    }
    
  
    @Post('/babapk/create')
    async createClan(@User() user: any, @Body('name') name: string) {
       return await this.clanService.clanCreateService(name, user.admin);
    }
  
    @Delete('babapk/delete')
    async removeClan(@User() user: any, @Body('clan') clan: string) {
        return await this.clanService.clanRemoveService(clan, user.admin);
  }
}
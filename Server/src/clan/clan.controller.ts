import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Req,
    Patch,
    UseGuards,
  } from '@nestjs/common';
  import { ClanService } from './clan.service';
import { User } from 'src/user/user.decorator';
import { Roles } from 'src/guard/roles.decorator';
import { RolesGuard } from 'src/guard/auth.guard';
  
  
  @Controller('clan')
  export class ClanController {
    constructor(private readonly clanService: ClanService) {}
  
    @Get('/babapk/list')
      @UseGuards(RolesGuard)
      @Roles("admin", "user", "guest")
    async getClanList() {
        const result = await this.clanService.clanListService();
        return result;
    }

    @Post('/babapk/myclan')
    @UseGuards(RolesGuard)
    @Roles("admin", "user")  
    async getMyClan(@User() user:any){
      return await this.clanService.getMyClanService(user.username);
    }
  
    @Patch('/babapk/join')
    @UseGuards(RolesGuard)
    @Roles("admin", "user")  
    async joinClan(@Body('clanname') clanname: string, @User() user:any) {
        return await this.clanService.clanJoinService(
          user.username,
          clanname,
        );
    }
  
    @Post('/babapk/reset')
    @UseGuards(RolesGuard)
    @Roles("admin")  
    async resetClan(@Body('player') player: string) {     
        return await this.clanService.clanResetService(player);
    }
  
    @Post('/babapk/score')
    @UseGuards(RolesGuard)
    @Roles("admin")  
    async updateClanScore(
      @Body('clan') clan: string,
      @Body('clanScore') clanScore: number,
    ) { 
        return await this.clanService.adminClanScoreService(
          clan,
          clanScore,
        );
  
    }
    
  
    @Post('/babapk/create')
    @UseGuards(RolesGuard)
    @Roles("admin")  
    async createClan(@Body('name') name: string) {
       return await this.clanService.clanCreateService(name);
    }
  
    @Delete('babapk/delete')
    @UseGuards(RolesGuard)
    @Roles("admin")  
    async removeClan(@Body('clan') clan: string) {
        return await this.clanService.clanRemoveService(clan);
  }
}
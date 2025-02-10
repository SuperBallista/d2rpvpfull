import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { NicknameService } from './get-nickname.service';
import { RolesGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/guard/roles.decorator';

@Controller('/nicknames')
  @UseGuards(RolesGuard)
  @Roles("admin", "user", "guest")
export class NicknameController {
  constructor(private readonly nicknameService: NicknameService) {}

  @Get()
  async getUserNicknames(@Query('mode') mode:string) {
      return await this.nicknameService.getUserNicknames(mode);
  }
}

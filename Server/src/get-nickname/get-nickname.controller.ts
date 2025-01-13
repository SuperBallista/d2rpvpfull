import { Controller, Get, Query } from '@nestjs/common';
import { NicknameService } from './get-nickname.service';

@Controller('/nicknames')
export class NicknameController {
  constructor(private readonly nicknameService: NicknameService) {}

  @Get()
  async getUserNicknames(@Query('mode') mode:string) {
      return await this.nicknameService.getUserNicknames(mode);
  }
}

import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { NicknameService } from './get-nickname.service';

@Controller('/nicknames')
export class NicknameController {
  constructor(private readonly nicknameService: NicknameService) {}

  @Get('/babapk')
  async getBUserNicknames() {
    try {
      const nicknames = await this.nicknameService.getBUserNicknames();
      return nicknames;
    } catch (error) {
      console.error('Error fetching BUser nicknames:', error);
      throw new HttpException(
        'Failed to fetch BUser nicknames.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/mpk')
  async getMUserNicknames() {
    try {
      const nicknames = await this.nicknameService.getMUserNicknames();
      return nicknames;
    } catch (error) {
      console.error('Error fetching MUser nicknames:', error);
      throw new HttpException(
        'Failed to fetch MUser nicknames.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


@Get('/zpke')
async getZUserNicknames() {
  try {
    const nicknames = await this.nicknameService.getZUserNicknames();
    return nicknames;
  } catch (error) {
    console.error('Error fetching ZUser nicknames:', error);
    throw new HttpException(
      'Failed to fetch ZUser nicknames.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
}

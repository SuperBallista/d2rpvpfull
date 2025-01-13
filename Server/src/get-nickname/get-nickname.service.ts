import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BUser } from '../entities/b-user.entity';
import { MUser } from '../entities/m-user.entity';
import { ZUser } from 'src/entities/z-user.entity';

@Injectable()
export class NicknameService {
  constructor(
    @InjectRepository(BUser)
    private readonly bUserRepository: Repository<BUser>,
    @InjectRepository(MUser)
    private readonly mUserRepository: Repository<MUser>,
    @InjectRepository(ZUser)
    private readonly zUserRepository: Repository<ZUser>,
  ) {}

  // Get nicknames from user table
  async getUserNicknames(mode:string): Promise<string[]> {
    let userRepository
    if (mode === "babapk")
    {userRepository = this.bUserRepository}
    else if (mode === "mpk")
    {userRepository = this.mUserRepository}
    else if (mode === "zpke")
    {userRepository = this.zUserRepository}
    else
    {throw new HttpException("모드값이 잘못되었습니다", HttpStatus.BAD_REQUEST)}
    try {
      const users = await userRepository.find({
        select: ['nickname'],
      });
      return users.map(user => user.nickname);
    } catch (error) {
      throw new HttpException("서버 오류 발생", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}

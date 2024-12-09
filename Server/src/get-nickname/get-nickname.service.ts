import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { BUser } from '../entities/b-user.entity';
import { MUser } from '../entities/m-user.entity';

@Injectable()
export class NicknameService {
  constructor(
    @InjectRepository(BUser)
    private readonly bUserRepository: Repository<BUser>,
    @InjectRepository(MUser)
    private readonly mUserRepository: Repository<MUser>,
  ) {}

  // Get nicknames from `b_user` table excluding admin
  async getBUserNicknames(): Promise<string[]> {
    try {
      const users = await this.bUserRepository.find({
        where: { nickname: Not('admin') },
        select: ['nickname'],
      });
      return users.map(user => user.nickname);
    } catch (error) {
      console.error('Error fetching BUser nicknames:', error);
      throw new Error('Database error occurred while fetching BUser nicknames.');
    }
  }

  // Get nicknames from `m_user` table excluding admin_m
  async getMUserNicknames(): Promise<string[]> {
    try {
      const users = await this.mUserRepository.find({
        where: { nickname: Not('admin_m') },
        select: ['nickname'],
      });
      return users.map(user => user.nickname);
    } catch (error) {
      console.error('Error fetching MUser nicknames:', error);
      throw new Error('Database error occurred while fetching MUser nicknames.');
    }
  }
}

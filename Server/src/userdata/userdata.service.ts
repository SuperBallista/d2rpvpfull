import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BUser } from '../entities/b-user.entity';
import { MUser } from '../entities/m-user.entity';
import { BRecord } from '../entities/b-record.entity';
// import { MClanRecord } from '../entities/m-clanrecord.entity';
import * as bcrypt from 'bcrypt';
import { MRecord } from 'src/entities/m-record.entity';
import { ZUser } from 'src/entities/z-user.entity';
import { ZOldRecord } from 'src/entities/z-oldrecord.entity';
import { ZRecord } from 'src/entities/z-record.entity';
import { Account } from 'src/entities/account.entity';

@Injectable()
export class UserDataService {
  constructor(
    @InjectRepository(BUser) private readonly bUserRepository: Repository<BUser>,
    @InjectRepository(MUser) private readonly mUserRepository: Repository<MUser>,
    @InjectRepository(ZUser) private readonly zUserRepository: Repository<ZUser>,
    @InjectRepository(BRecord) private readonly bRecordRepository: Repository<BRecord>,
    @InjectRepository(MRecord) private readonly mRecordRepository: Repository<MRecord>,
    @InjectRepository(ZRecord) private readonly zRecordRepository: Repository<ZRecord>,
    @InjectRepository(Account) private readonly AccountRepository: Repository<Account>
    // @InjectRepository(MClanRecord) private readonly mClanRecordRepository: Repository<MClanRecord>,
  ) {}

  // 사용자 정보 및 전적 조회
  async getUserData(nickname: string, userTable: string): Promise<any> {
let user
    if (userTable === 'babapk') {
     user = await this.bUserRepository.findOne({ where: { nickname } });
      }
    else if (userTable === 'mpk') {
      user = await this.mUserRepository.findOne({ where: { nickname } });
    } else if (userTable === 'zpke') {
      user = await this.zUserRepository.findOne({where: { nickname}});
    }

    try {

        if (!user) {
          throw new HttpException('사용자를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
        }

        let recordRepository
        
        if (userTable === 'babapk')
          {recordRepository = this.bRecordRepository }
        else if (userTable === 'mpk')
          {recordRepository =  this.mRecordRepository}
        else
          {recordRepository = this.zRecordRepository}
      
      const [winCount, loseCount] = await Promise.all([
        recordRepository.count({
          where: [
            { winner: nickname },
            { win2: nickname },
            { win3: nickname },
            { win4: nickname },
          ],
        }),
        recordRepository.count({
          where: [
            { loser: nickname },
            { lose2: nickname },
            { lose3: nickname },
            { lose4: nickname },
          ],
        }),
      ]);
      
        return {
          nickname: user.nickname,
          email: user.email,
          bscore: user.bScore.toString(),
          lscore: user.lScore.toString(),
          countwin: winCount.toString(),
          countlose: loseCount.toString(),
          countrecord: (winCount + loseCount).toString(),
          challenge: userTable != 'babapk'? user.challenge || "" : null,
          challengeDate: userTable != 'babapk'? user.challengeDate || "" : null,
        }
    } catch (error) {
      console.error('사용자 정보 및 전적 조회 오류:', error);
      throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 이메일 변경
  async changeEmail(userNickname: string, nowpw: string, newemail: string): Promise<any> {
    try {
      let repository = this.AccountRepository
      const user = await repository.findOne({ where: { account: userNickname } });

      if (!user) {
        throw new HttpException('사용자를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      }

      const passwordMatch = await bcrypt.compare(nowpw, user.password);

      if (!passwordMatch) {
        throw new HttpException('현재 암호가 일치하지 않습니다.', HttpStatus.UNAUTHORIZED);
      }

      user.email = newemail;
        await this.AccountRepository.save(user);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  // 비밀번호 변경
  async changePassword(userNickname: string, nowpw: string, newpw: string): Promise<any> {
    try {

      let repository = this.AccountRepository
      const user = await repository.findOne({ where: { account: userNickname } });

      if (!user) {
        throw new HttpException('사용자를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      }

      const passwordMatch = await bcrypt.compare(nowpw, user.password);

      if (!passwordMatch) {
        throw new HttpException('현재 암호가 일치하지 않습니다.', HttpStatus.UNAUTHORIZED);
      }

      user.password = await bcrypt.hash(newpw, 10);
        await this.AccountRepository.save(user);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  // 도전 취소
  async cancelChallenge(userNickname: string, tablePrefix: string): Promise<void> {
    try {
      if (tablePrefix === 'z') {
        const user = await this.zUserRepository.findOne({ where: { nickname: userNickname } });
        if (user) {
          user.challenge = null;
          user.challengeDate = null;
          await this.zUserRepository.save(user);
        }
      } else {
        const user = await this.mUserRepository.findOne({ where: { nickname: userNickname } });
        if (user) {
          user.challenge = null;
          user.challengeDate = null;
          await this.mUserRepository.save(user);
        }
      }
    } catch (error) {
      console.error('도전 취소 오류:', error);
      throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
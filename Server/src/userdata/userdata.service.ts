import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BUser } from '../entities/b-user.entity';
import { MUser } from '../entities/m-user.entity';
import { BRecord } from '../entities/b-record.entity';
// import { MClanRecord } from '../entities/m-clanrecord.entity';
import * as bcrypt from 'bcrypt';
import { MRecord } from 'src/entities/m-record.entity';

@Injectable()
export class UserDataService {
  constructor(
    @InjectRepository(BUser) private readonly bUserRepository: Repository<BUser>,
    @InjectRepository(MUser) private readonly mUserRepository: Repository<MUser>,
    @InjectRepository(BRecord) private readonly bRecordRepository: Repository<BRecord>,
    @InjectRepository(MRecord) private readonly mRecordRepository: Repository<MRecord>,
    // @InjectRepository(MClanRecord) private readonly mClanRecordRepository: Repository<MClanRecord>,
  ) {}

  // 사용자 정보 및 전적 조회
  async getUserData(userNickname: string, userTable: string): Promise<any> {
let user
    if (userTable === 'b_user') {
     user = await this.bUserRepository.findOne({ where: { nickname: userNickname } });
      }
    else {
      user = await this.mUserRepository.findOne({ where: { nickname: userNickname } });
    }

    try {

        if (!user) {
          throw new HttpException('사용자를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
        }

        const recordRepository =
        userTable === 'b_user' ? this.bRecordRepository : this.mRecordRepository;
      
      const [winCount, loseCount] = await Promise.all([
        recordRepository.count({
          where: [
            { winner: userNickname },
            { win2: userNickname },
            { win3: userNickname },
            { win4: userNickname },
          ],
        }),
        recordRepository.count({
          where: [
            { loser: userNickname },
            { lose2: userNickname },
            { lose3: userNickname },
            { lose4: userNickname },
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
        }
    } catch (error) {
      console.error('사용자 정보 및 전적 조회 오류:', error);
      throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 이메일 변경
  async changeEmail(userNickname: string, nowpw: string, newemail: string, userTable: string): Promise<any> {
    try {
      const repository = userTable === 'b_user' ? this.bUserRepository : this.mUserRepository;

      const user = await repository.findOne({ where: { nickname: userNickname } });

      if (!user) {
        throw new HttpException('사용자를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      }

      const passwordMatch = await bcrypt.compare(nowpw, user.pw);

      if (!passwordMatch) {
        throw new HttpException('현재 암호가 일치하지 않습니다.', HttpStatus.UNAUTHORIZED);
      }

      user.email = newemail;
      if (userTable === 'b_user') {
        await this.bUserRepository.save(user as BUser);
      } else {
        await this.mUserRepository.save(user as MUser);
      }
      return { success: true };
    } catch (error) {
      console.error('이메일 변경 오류:', error);
      throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 비밀번호 변경
  async changePassword(userNickname: string, nowpw: string, newpw: string, userTable: string): Promise<any> {
    try {
      const repository = userTable === 'b_user' ? this.bUserRepository : this.mUserRepository;

      const user = await repository.findOne({ where: { nickname: userNickname } });

      if (!user) {
        throw new HttpException('사용자를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      }

      const passwordMatch = await bcrypt.compare(nowpw, user.pw);

      if (!passwordMatch) {
        throw new HttpException('현재 암호가 일치하지 않습니다.', HttpStatus.UNAUTHORIZED);
      }

      user.pw = await bcrypt.hash(newpw, 10);
      if (userTable === 'b_user') {
        await this.bUserRepository.save(user as BUser);
      } else {
        await this.mUserRepository.save(user as MUser);
      }
      
      return { success: true };
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 도전 취소
  async cancelChallenge(userNickname: string, tablePrefix: string): Promise<void> {
    try {
      if (tablePrefix === 'b') {
        const user = await this.bUserRepository.findOne({ where: { nickname: userNickname } });
        if (user) {
          user.challenge = null;
          user.challengeDate = null;
          await this.bUserRepository.save(user);
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

  // 도전 확인
  async checkChallenge(
    userNickname: string,
    challenge: string,
    tablePrefix: string,
  ): Promise<void> {
    try {
      const repository = tablePrefix === 'b' ? this.bUserRepository : this.mUserRepository;

      const user = await repository.findOne({ where: { nickname: userNickname } });

      if (!user || !user.challengeDate) {
        throw new HttpException('도전 기록이 없거나 유효한 날짜가 아닙니다.', HttpStatus.BAD_REQUEST);
      }

      const diffInDays = (new Date().getTime() - user.challengeDate.getTime()) / (1000 * 60 * 60 * 24);

      if (diffInDays <= 7) {
        throw new HttpException('아직 기간이 남았습니다.', HttpStatus.BAD_REQUEST);
      }

      if (!challenge) {
        throw new HttpException('도전 중인 상대가 없습니다.', HttpStatus.BAD_REQUEST);
      }

      // 로직: 도전 경기 기권 처리
      // 추가적인 기록 업데이트 로직을 구현
    } catch (error) {
      console.error('도전 확인 오류:', error);
      throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

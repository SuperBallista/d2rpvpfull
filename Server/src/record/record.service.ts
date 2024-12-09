import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BRecord } from '../entities/b-record.entity';
import { MRecord } from '../entities/m-record.entity';
import { BUser } from '../entities/b-user.entity';
import { MUser } from '../entities/m-user.entity';
import { BTemp } from '../entities/b-temp.entity';
import { MTemp } from '../entities/m-temp.entity';
import * as moment from 'moment';
import { K_VALUE_B, E_VALUE_B, K_VALUE_M, E_VALUE_M } from '../config/constants';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(BRecord)
    private readonly bRecordRepository: Repository<BRecord>,
    @InjectRepository(MRecord)
    private readonly mRecordRepository: Repository<MRecord>,
    @InjectRepository(BUser)
    private readonly bUserRepository: Repository<BUser>,
    @InjectRepository(MUser)
    private readonly mUserRepository: Repository<MUser>,
    @InjectRepository(BTemp)
    private readonly bTempRepository: Repository<BTemp>,
    @InjectRepository(MTemp)
    private readonly mTempRepository: Repository<MTemp>,
    private readonly dataSource: DataSource,
  ) {}

  // 기록 삭제
  async deleteRecord(orderNum: number, isMUser: string, admin: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const record = await queryRunner.manager.query(
        `SELECT Winner, Win2, Win3, Win4, Loser, Lose2, Lose3, Lose4, AddScore 
         FROM ${isMUser === 'm' ? 'm_record' : 'b_record'}
         WHERE OrderNum = ?`,
        [orderNum],
      );

      if (!record || record.length === 0) {
        throw new HttpException('Row not found', HttpStatus.NOT_FOUND);
      }

      const winnerNicknames = [record[0].Winner, record[0].Win2, record[0].Win3, record[0].Win4];
      const loserNicknames = [record[0].Loser, record[0].Lose2, record[0].Lose3, record[0].Lose4];
      const addScore = Number(record[0].AddScore);

      // 점수 업데이트 및 기록 삭제
      await queryRunner.manager.query(
        `UPDATE ${isMUser === 'm' ? 'm_user' : 'b_user'} SET BScore = BScore - ? WHERE Nickname IN (?, ?, ?, ?)`,
        [addScore, ...winnerNicknames],
      );
      await queryRunner.manager.query(
        `UPDATE ${isMUser === 'm' ? 'm_user' : 'b_user'} SET BScore = BScore + ? WHERE Nickname IN (?, ?, ?, ?)`,
        [addScore, ...loserNicknames],
      );
      await queryRunner.manager.query(`DELETE FROM ${isMUser === 'm' ? 'm_record' : 'b_record'} WHERE OrderNum = ?`, [orderNum]);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error deleting record:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // 승인 대기중인 기록 가져오기
  async fetchPendingRecords(nickname: string, isMUser: string): Promise<any[]> {
    const tempRepository = isMUser === 'm' ? this.mTempRepository : this.bTempRepository;
    try {
      return await tempRepository.find({
        where: { winner: nickname, checked: 0 },
        order: { orderNum: 'ASC' },
      });
    } catch (error) {
      console.error('Error fetching pending records:', error);
      throw new HttpException('Failed to fetch pending records', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 기록 제출
  async submitRecord(winner: string, isMUser: string, submitter: string): Promise<void> {
    const tempRepository = isMUser === 'm' ? this.mTempRepository : this.bTempRepository;
    const currentDate = moment().utcOffset('+0900').format('YYYY-MM-DD HH:mm:ss');
    const record = tempRepository.create({
      date: new Date(currentDate),
      winner,
      loser: submitter,
      checked: 0,
    });

    try {
      await tempRepository.save(record);
      console.log(`Record submitted: Winner: ${winner}, Loser: ${submitter}`);
    } catch (error) {
      console.error('Error submitting record:', error);
      throw new HttpException('Failed to submit record', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

    // 기록 취소
    async cancelRecord(orderNum: number, isMUser: string): Promise<void> {
      const tempRepository = isMUser === 'm' ? this.mTempRepository : this.bTempRepository;
      const tempRecord = await tempRepository.findOneBy({ orderNum });
      if (!tempRecord) {
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
      }
      // 승인 상태 업데이트
      tempRecord.checked = 2;
      await tempRepository.save(tempRecord);
    }



  // 기록 승인
  async approveRecord(orderNum: number, isMUser: string): Promise<void> {
    const tempRepository = isMUser === 'm' ? this.mTempRepository : this.bTempRepository;
    const recordRepository = isMUser === 'm' ? this.mRecordRepository : this.bRecordRepository;
    const userRepository = isMUser === 'm' ? this.mUserRepository : this.bUserRepository;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tempRecord = await tempRepository.findOneBy({ orderNum });
      if (!tempRecord) {
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
      }

      const winner = await userRepository.findOneBy({ nickname: tempRecord.winner });
      const loser = await userRepository.findOneBy({ nickname: tempRecord.loser });

      if (!winner || !loser) {
        throw new HttpException('Winner or Loser not found', HttpStatus.NOT_FOUND);
      }

      // 점수 계산
      const winnerScore = Number(winner.bScore);
      const loserScore = Number(loser.bScore);
      const K_VALUE = isMUser === 'm' ? K_VALUE_M : K_VALUE_B;
      const E_VALUE = isMUser === 'm' ? E_VALUE_M : E_VALUE_B;
      const addScore = K_VALUE * (1 - 1 / (1 + 10 ** ((loserScore - winnerScore) / E_VALUE)));

      // 점수 업데이트
      winner.bScore += addScore;
      loser.bScore -= addScore;

      await (userRepository as Repository<BUser | MUser>).save([winner, loser]);

      // 기록 저장
      const record = recordRepository.create({
        ...tempRecord,
        wScore: 5,
        lScore: 0,
        addScore: addScore,
        checked: 1,
      } as Partial<BRecord | MRecord>);
      await recordRepository.save(record);

      // 승인 상태 업데이트
      tempRecord.checked = 1;
      await tempRepository.save(tempRecord);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error approving record:', error);
      throw new HttpException('Failed to approve record', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  // 기록 데이터 가져오기
  async fetchRecordData(mode: string): Promise<any[]> {
    const recordRepository = mode ==="true" ? this.mRecordRepository : this.bRecordRepository;
    try {
      return await recordRepository.find({ order: { orderNum: 'DESC' } });
    } catch (error) {
      console.error('Error fetching record data:', error);
      throw new HttpException('Failed to fetch record data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 도전 경기 자동 패배 기록
  async challengeLose(isMUser: string, winner: string, loser: string): Promise<void> {
    const tempRepository = isMUser === 'm' ? this.mTempRepository : this.bTempRepository;
    const userRepository = isMUser === 'm' ? this.mUserRepository : this.bUserRepository;

    const currentDate = moment().utcOffset('+0900').format('YYYY-MM-DD HH:mm:ss');
    const record = tempRepository.create({
      date: new Date(currentDate),
      winner,
      loser,
      checked: 0,
    });

    try {
      await tempRepository.save(record);
      const latestRecord = await tempRepository.findOne({
        where: { winner, loser },
        order: { orderNum: 'DESC' },
      });
      if (!latestRecord) throw new HttpException('Failed to find record', HttpStatus.NOT_FOUND);

      await this.approveRecord(latestRecord.orderNum, isMUser);

      // 도전 상태 초기화
      const losingUser = await userRepository.findOneBy({ nickname: loser });
      if (losingUser) {
        losingUser.challenge = null;
        losingUser.challengeDate = null;
        await (userRepository as Repository<BUser | MUser>).save(losingUser);
      }
    } catch (error) {
      console.error('Error processing challenge lose:', error);
      throw new HttpException('Failed to process challenge lose', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async challengeWin(isMUser: string, winner: string): Promise<void> {
    const tempRepository = isMUser === 'm' ? this.mTempRepository : this.bTempRepository;
    const userRepository = isMUser === 'm' ? this.mUserRepository : this.bUserRepository;

    const user = await userRepository.findOne({ where: { nickname: winner } });
    if (user) {
      user.challenge = null;
      user.challengeDate = null;
      await (userRepository as Repository<BUser | MUser>).save(user);
    }
  }
}

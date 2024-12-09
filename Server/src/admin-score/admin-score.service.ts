import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BUser } from '../entities/b-user.entity';
import { MUser } from '../entities/m-user.entity';

@Injectable()
export class AdminScoreService {
  constructor(
    @InjectRepository(BUser)
    private readonly bUserRepository: Repository<BUser>,
    @InjectRepository(MUser)
    private readonly mUserRepository: Repository<MUser>,
    private readonly dataSource: DataSource, // 트랜잭션에 사용
  ) {}

  // 사용자 점수 업데이트
  async updateUserScore(tableName: 'b_user' | 'm_user', player: string, adminScore: number): Promise<void> {
    let repository;

    // 테이블에 따라 Repository 선택
    if (tableName === 'b_user') {
      repository = this.bUserRepository;
    } else if (tableName === 'm_user') {
      repository = this.mUserRepository;
    } else {
      throw new Error('올바르지 않은 테이블 이름입니다.');
    }

    // 점수 업데이트
    await repository
      .createQueryBuilder()
      .update()
      .set({ lScore: () => `LScore + ${adminScore}` })
      .where('nickname = :nickname', { nickname: player })
      .execute();
  }

  // 랭킹 리셋 및 데이터 백업 로직
  async resetRank(
    userTable: 'b_user' | 'm_user',
    recordTable: string,
    tempTable: string,
    eventRecordTable: string,
    oldRecordTable: string,
    oldHistoryTable: string,
    oldTournamentTable: string,
    score: number,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 사용자 데이터 백업
      await queryRunner.manager.query(`
        INSERT INTO ${oldRecordTable} (Nickname, BScore, LScore, Class, Month)
        SELECT Nickname, BScore, LScore, Class, DATE_FORMAT(NOW(), '%Y-%m-01')
        FROM ${userTable};
      `);

      // 기록 데이터 백업
      await queryRunner.manager.query(`
        INSERT INTO ${oldHistoryTable} (Date, Winner, Loser, Win2, Win3, Win4, Lose2, Lose3, Lose4, WScore, LScore)
        SELECT Date, Winner, Loser, Win2, Win3, Win4, Lose2, Lose3, Lose4, WScore, LScore
        FROM ${recordTable};
      `);

      // 대회 기록 백업
      await queryRunner.manager.query(`
        INSERT INTO ${oldTournamentTable} (eventname, Championship, Runner_up, Place3rd, numberteams)
        SELECT eventname, Championship1, Runner_up1, Place3rd1, numberteams
        FROM ${eventRecordTable}
        WHERE teamSize = 1 AND accept = 2;
      `);

      // 사용자 점수 초기화
      await queryRunner.manager
        .createQueryBuilder()
        .update(userTable)
        .set({
          bScore: score,
          lScore: 0,
          records: 0,
          rScore: 0,
        })
        .execute();

      if (userTable === 'm_user') {
        await queryRunner.manager.query(`UPDATE m_clan SET Score = 0`);
        await queryRunner.manager.query(`DELETE FROM m_clanrecord`);
        await queryRunner.manager.query(`DELETE FROM m_clanrecordtemp`);
      }

      // 기록 및 임시 테이블 초기화
      await queryRunner.manager.query(`DELETE FROM ${recordTable};`);
      await queryRunner.manager.query(`DELETE FROM ${tempTable};`);
      await queryRunner.manager.query(`DELETE FROM ${eventRecordTable};`);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('랭킹 리셋 실패:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

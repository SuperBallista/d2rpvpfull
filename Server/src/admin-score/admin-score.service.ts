import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BUser } from '../entities/b-user.entity';
import { MUser } from '../entities/m-user.entity';
import { ZUser } from 'src/entities/z-user.entity';
import { START_SCORE, START_SCORE_M, START_SCORE_Z } from 'src/config/constants';

@Injectable()
export class AdminScoreService {
  constructor(
    @InjectRepository(BUser)
    private readonly bUserRepository: Repository<BUser>,
    @InjectRepository(MUser)
    private readonly mUserRepository: Repository<MUser>,
    @InjectRepository(ZUser)
    private readonly zUserRepository: Repository<ZUser>,
    private readonly dataSource: DataSource, // 트랜잭션에 사용
  ) {}

  // 사용자 점수 업데이트
  async updateUserScore(mode: string, player: string, adminScore: number): Promise<void> {


    let repository;

    // 테이블에 따라 Repository 선택
    if (mode === 'babapk') {
      repository = this.bUserRepository;
    } else if (mode === 'mpk') {
      repository = this.mUserRepository;
    } else if (mode === "zpke")
    {repository = this.zUserRepository;}
    else
     {
      throw new HttpException('잘못된 상태값입니다. ' + mode, HttpStatus.BAD_REQUEST);
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
    userTable: string,
    recordTable: string,
    tempTable: string,
    eventRecordTable: string,
    oldRecordTable: string,
    oldHistoryTable: string,
    oldTournamentTable: string,
    mode: string,
    admin: string
  ): Promise<void> {
    const allowedTables = ['b_user', 'm_user', 'z_user']; // 허용된 테이블 목록
    if (!allowedTables.includes(userTable)) {
      throw new HttpException('잘못된 테이블 이름입니다.', HttpStatus.BAD_REQUEST);
    }
  
    // 나머지 로직 실행
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let score

    if (mode==="babapk") {score = START_SCORE}
    else if (mode === "mpk") {score = START_SCORE_M}
    else if (mode === "zpke") {score = START_SCORE_Z}
    else {throw new HttpException('잘못된 상태값입니다. ' + mode, HttpStatus.BAD_REQUEST);}

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

      if (userTable === 'b_user') {
        await queryRunner.manager.query(`UPDATE b_user SET clan = "none"`);
        await queryRunner.manager.query(`DELETE FROM b_clan`);
      }


      // 기록 및 임시 테이블 초기화
      await queryRunner.manager.query(`DELETE FROM ${recordTable};`);
      await queryRunner.manager.query(`DELETE FROM ${tempTable};`);
      await queryRunner.manager.query(`DELETE FROM ${eventRecordTable};`);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException('알 수 없는 오류입니다' + error, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }
}
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BRecord } from '../entities/b-record.entity';
import { MRecord } from '../entities/m-record.entity';
import { ZRecord } from 'src/entities/z-record.entity';
import { BUser } from '../entities/b-user.entity';
import { MUser } from '../entities/m-user.entity';
import { ZUser } from 'src/entities/z-user.entity';
import { BTemp } from '../entities/b-temp.entity';
import { MTemp } from '../entities/m-temp.entity';
import { ZTemp } from 'src/entities/z-temp.entity';
import * as moment from 'moment';
import { K_VALUE_B, E_VALUE_B, K_VALUE_M, E_VALUE_M, K_VALUE_Z, E_VALUE_Z, K_VALUE_CLAN_B_RATIO } from '../config/constants';
import { BClan } from 'src/entities/b-clan.entity';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(BRecord)
    private readonly bRecordRepository: Repository<BRecord>,
    @InjectRepository(MRecord)
    private readonly mRecordRepository: Repository<MRecord>,
    @InjectRepository(ZRecord)
    private readonly zRecordRepository: Repository<ZRecord>,
    @InjectRepository(BUser)
    private readonly bUserRepository: Repository<BUser>,
    @InjectRepository(MUser)
    private readonly mUserRepository: Repository<MUser>,
    @InjectRepository(ZUser)
    private readonly zUserRepository: Repository<ZUser>,
    @InjectRepository(BTemp)
    private readonly bTempRepository: Repository<BTemp>,
    @InjectRepository(MTemp)
    private readonly mTempRepository: Repository<MTemp>,
    @InjectRepository(ZTemp)
    private readonly zTempRepository: Repository<ZTemp>,
    @InjectRepository(BClan)
    private readonly bClanRepository: Repository<BClan>,
    private readonly dataSource: DataSource,
  ) {}

  // 기록 삭제
  async deleteRecord(orderNum: number, mode: string): Promise<void> {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let tableName = mode.slice(0,1)
    if (tableName!="b" && tableName!="m" && tableName!="z")
    {throw new HttpException('Mode Error', HttpStatus.BAD_REQUEST);}

    try {
      const allowedTables = ['b', 'm', 'z']; // 허용된 테이블 리스트
      if (!allowedTables.includes(tableName)) {
        throw new Error('Invalid table name');
      }
      
      const record = await queryRunner.manager
        .createQueryBuilder()
        .select(['Winner', 'Win2', 'Win3', 'Win4', 'Loser', 'Lose2', 'Lose3', 'Lose4', 'AddScore'])
        .from(`${tableName}_record`, 'r') // 안전한 테이블 바인딩
        .where('OrderNum = :orderNum', { orderNum })
        .getRawMany();
      

      if (!record || record.length === 0) {
        throw new HttpException('Row not found', HttpStatus.NOT_FOUND);
      }

      const winnerNicknames = [record[0].Winner, record[0].Win2, record[0].Win3, record[0].Win4];
      const loserNicknames = [record[0].Loser, record[0].Lose2, record[0].Lose3, record[0].Lose4];
      const addScore = Number(record[0].AddScore);


      if (!allowedTables.includes(tableName)) {
        throw new Error('Invalid table name');
      }
      
      await queryRunner.manager
        .createQueryBuilder()
        .update(`${tableName}_user`) // 안전한 테이블 바인딩
        .set({ bScore: () => "BScore - :addScore", records: () => "Records - 1" })
        .where("Nickname IN (:...nicknames)", { nicknames: winnerNicknames, addScore })
        .execute();
      
      await queryRunner.manager
        .createQueryBuilder()
        .update(`${tableName}_user`)
        .set({ bScore: () => "BScore + :addScore", records: () => "Records - 1" })
        .where("Nickname IN (:...nicknames)", { nicknames: loserNicknames, addScore })
        .execute();
            
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(`${tableName}_record`) // 안전한 테이블 바인딩
        .where('OrderNum = :orderNum', { orderNum })
        .execute();
      

      if (mode === "babapk") {
        // Winner와 Loser를 데이터베이스에서 조회
        const winner = await this.bUserRepository.findOne({where: {nickname: record[0].Winner}})
        const loser = await this.bUserRepository.findOne({where: {nickname: record[0].Loser}})
      
        // Winner와 Loser가 유효하고, 각 사용자가 클랜에 속해 있는 경우
        if (winner?.clan != "none" && loser?.clan != "none") {
          // Winner 클랜 처리
          const WinClan = await this.bClanRepository.findOne({ where: { name: winner.clan } });
          if (WinClan) {
            WinClan.Bscore -= addScore * K_VALUE_CLAN_B_RATIO;
            await this.bClanRepository.save(WinClan);
          } 
      
          // Loser 클랜 처리
          const LoseClan = await this.bClanRepository.findOne({ where: { name: loser.clan } });
          if (LoseClan) {
            LoseClan.Bscore += addScore * K_VALUE_CLAN_B_RATIO;
            await this.bClanRepository.save(LoseClan);
          } 
        }
      }



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
  async fetchPendingRecords(nickname: string, mode: string): Promise<any[]> {
    console.log("닉네임",nickname,"모드",mode)
    let tempRepository
    if (mode === "babapk")
    {tempRepository = this.bTempRepository}
    else if (mode === "mpk")
    {tempRepository = this.mTempRepository}
    else
    {tempRepository = this.zTempRepository}
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
  async submitRecord(winner: string, mode: string, submitter: string): Promise<void> {
    let tempRepository
    if (mode === "babapk")
    {tempRepository = this.bTempRepository}
    else if (mode === "mpk")
    {tempRepository = this.mTempRepository}
    else
    {tempRepository = this.zTempRepository}

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
    async cancelRecord(orderNum: number, mode: string): Promise<void> {
let tempRepository
if (mode === "babapk")
{tempRepository = this.bTempRepository}
else if (mode === "mpk")
{tempRepository = this.mTempRepository}
else
{tempRepository = this.zTempRepository}
      const tempRecord = await tempRepository.findOneBy({ orderNum });
      if (!tempRecord) {
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
      }
      // 승인 상태 업데이트
      tempRecord.checked = 2;
      await tempRepository.save(tempRecord);
    }



  // 기록 승인
  async approveRecord(orderNum: number, mode: string): Promise<void> {
    let tempRepository
    let recordRepository
    let userRepository
    let K_VALUE
    let E_VALUE
    let clanRepository

    if (mode === "babapk")
    {
      tempRepository = this.bTempRepository
      recordRepository = this.bRecordRepository
      userRepository = this.bUserRepository
      clanRepository = this.bClanRepository
      K_VALUE = K_VALUE_B
      E_VALUE = E_VALUE_B
    }
    else if (mode === "mpk")
    {
      tempRepository = this.mTempRepository
      recordRepository = this.mRecordRepository
      userRepository = this.mUserRepository
      K_VALUE = K_VALUE_M
      E_VALUE = E_VALUE_M
    }
    else
    {
      tempRepository = this.zTempRepository
      recordRepository = this.zRecordRepository
      userRepository = this.zUserRepository
      K_VALUE = K_VALUE_Z
      E_VALUE = E_VALUE_Z
    }

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

      const addScore = K_VALUE * (1 - 1 / (1 + 10 ** ((loserScore - winnerScore) / E_VALUE)));

      // 점수 업데이트
      winner.bScore += addScore;
      loser.bScore -= addScore;
      winner.records += 1
      loser.records +=1

      await (userRepository as Repository<BUser | MUser | ZUser>).save([winner, loser]);

      // 기록 저장
      const record = recordRepository.create({
        ...tempRecord,
        wScore: 5,
        lScore: 0,
        addScore: addScore,
        checked: 1,
      } as Partial<BRecord | MRecord | ZRecord>);
      await recordRepository.save(record);

      // 승인 상태 업데이트
      tempRecord.checked = 1;
      await tempRepository.save(tempRecord);

      if (mode === "babapk") {
        // Winner와 Loser를 데이터베이스에서 조회
      
        // Winner와 Loser가 유효하고, 각 사용자가 클랜에 속해 있는 경우
        if (winner?.clan != "none" && loser?.clan != "none") {
          // Winner 클랜 처리
          const WinClan = await clanRepository.findOne({ where: { name: winner.clan } });
          if (WinClan) {
            WinClan.Bscore += addScore * K_VALUE_CLAN_B_RATIO;
            await clanRepository.save(WinClan);
          } 
      
          // Loser 클랜 처리
          const LoseClan = await clanRepository.findOne({ where: { name: loser.clan } });
          if (LoseClan) {
            LoseClan.Bscore -= addScore * K_VALUE_CLAN_B_RATIO;
            await clanRepository.save(LoseClan);
          } 
        }
      }
      
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
    let recordRepository
    if (mode === "babapk")
    {recordRepository = this.bRecordRepository}
    else if (mode === "mpk")
    {recordRepository = this.mRecordRepository}
    else
    {recordRepository = this.zRecordRepository};
    
    try {
    const data = await recordRepository.find({ order: { orderNum: 'DESC' } });
    return data  
  } catch (error) {
      console.error('Error fetching record data:', error);
      throw new HttpException('Failed to fetch record data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 도전 경기 자동 패배 기록
  async challengeLose(isMUser: string, winner: string, loser: string): Promise<string> {
    const tempRepository = isMUser === 'm' ? this.mTempRepository : this.zTempRepository;
    const userRepository = isMUser === 'm' ? this.mUserRepository : this.zUserRepository;

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
      const winnerUser = await userRepository.findOneBy({ nickname: winner });
      if (winnerUser) {
        winnerUser.challenge = null;
        winnerUser.challengeDate = null;
        await (userRepository as Repository<ZUser | MUser>).save(winnerUser);
      }

      return "ok"
    } catch (error) {
      console.error('Error processing challenge lose:', error);
      throw new HttpException('Failed to process challenge lose', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async challengeWin(isMUser: string, winner: string): Promise<void> {
    const userRepository = isMUser === 'm' ? this.mUserRepository : this.zUserRepository;

    const user = await userRepository.findOne({ where: { nickname: winner } });
    if (user) {
      user.challenge = null;
      user.challengeDate = null;
      await (userRepository as Repository<ZUser | MUser>).save(user);
    }
  }


  // 도전 확인
  async checkChallenge(
    userNickname: string,
    challenge: string,
    tablePrefix: string,
  ): Promise<void> {
    const repository =
      tablePrefix === 'm' ? this.mUserRepository : this.zUserRepository;
      
      if (!challenge) {
        throw new HttpException(
          '도전 중인 상대가 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

    try {
      const user = await repository.findOne({ where: { nickname: userNickname } });
  
      if (!user || !user.challengeDate) {
        throw new HttpException(
          '도전 기록이 없거나 유효한 날짜가 아닙니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
  
      const diffInDays =
        (new Date().getTime() - new Date(user.challengeDate).getTime()) /
        (1000 * 60 * 60 * 24);
  
      if (diffInDays <= 7) {
        throw new HttpException(
          '아직 기간이 남았습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
 
    } catch (error) {
      if (error instanceof HttpException) {
        console.log('HTTP Exception 상태 코드:', error.getStatus());
        throw error;
      }
    
      console.error('예상치 못한 오류:', error);
      throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BOldRecord } from '../entities/b-oldrecord.entity';
import { BOldHistory } from '../entities/b-oldhistory.entity';
import { MOldRecord } from '../entities/m_oldrecord.entity';
import { MOldHistory } from '../entities/m-oldhistory.entity';
import { BUser } from '../entities/b-user.entity';
import { MUser } from '../entities/m-user.entity';

@Injectable()
export class OldRecordService {
  constructor(
    @InjectRepository(BOldRecord)
    private readonly bOldRecordRepository: Repository<BOldRecord>,
    @InjectRepository(BOldHistory)
    private readonly bOldHistoryRepository: Repository<BOldHistory>,
    @InjectRepository(MOldRecord)
    private readonly mOldRecordRepository: Repository<MOldRecord>,
    @InjectRepository(MOldHistory)
    private readonly mOldHistoryRepository: Repository<MOldHistory>,
    @InjectRepository(BUser)
    private readonly bUserRepository: Repository<BUser>,
    @InjectRepository(MUser)
    private readonly mUserRepository: Repository<MUser>,
  ) {}

  // Fetch old records
  async fetchOldRecords(isMUser: boolean): Promise<any> {
    const recordRepository = isMUser ? this.mOldRecordRepository : this.bOldRecordRepository;

    const yearMonthQuery = `
      SELECT DISTINCT 
        YEAR(DATE_SUB(month, INTERVAL 1 MONTH)) AS year,
        MONTH(DATE_SUB(month, INTERVAL 1 MONTH)) AS month
      FROM ${isMUser ? 'm_oldrecord' : 'b_oldrecord'}
    `;

    const dataQuery = `
      SELECT 
        YEAR(DATE_SUB(month, INTERVAL 1 MONTH)) AS year,
        MONTH(DATE_SUB(month, INTERVAL 1 MONTH)) AS month,
        nickname,
        bScore + lScore AS tScore
      FROM ${isMUser ? 'm_oldrecord' : 'b_oldrecord'}
      WHERE nickname != :adminName
      ORDER BY tScore DESC
    `;

    const adminName = isMUser ? 'admin_m' : 'admin';
    const yearMonthResult = await recordRepository.query(yearMonthQuery);
    const dataResult = await recordRepository.query(dataQuery, [adminName]);

    const data = dataResult.map((row) => ({
      ...row,
      year: Number(row.year),
      month: Number(row.month),
    }));

    return { yearMonth: yearMonthResult, data };
  }

  // Fetch old history
  async fetchOldHistory(isMUser: boolean): Promise<any> {
    const historyRepository = isMUser ? this.mOldHistoryRepository : this.bOldHistoryRepository;

    const query = `
      SELECT 
        orderNum,
        date,
        winner,
        win2,
        win3,
        win4,
        loser,
        lose2,
        lose3,
        lose4,
        wScore,
        lScore
      FROM ${isMUser ? 'm_oldhistory' : 'b_oldhistory'}
      ORDER BY orderNum DESC
    `;

    const allRecord = await historyRepository.query(query);

    return allRecord.map((record) => ({
      ...record,
      date: new Intl.DateTimeFormat('en-US', {
        month: '2-digit',
        day: '2-digit',
      }).format(new Date(record.date)),
    }));
  }

  // Fetch rank data
  async fetchRankData(isMUser: boolean): Promise<any> {
    const userRepository = isMUser ? this.mUserRepository : this.bUserRepository;

    const query = `
      SELECT 
        nickname AS name
      FROM ${isMUser ? 'm_user' : 'b_user'}
      ORDER BY bScore + lScore DESC
    `;

    const data = await userRepository.query(query);

    const nicknamelist = data.map((row) => row.name);
    const rank = nicknamelist.map((_, index) => index + 1);

    return { nicknamelist, rank };
  }
}

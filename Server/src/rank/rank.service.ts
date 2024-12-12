import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { BUser } from '../entities/b-user.entity';
import { MUser } from '../entities/m-user.entity';
import { BRecord } from '../entities/b-record.entity';
import { MRecord } from '../entities/m-record.entity';
import { RECORD_SCORE } from '../config/constants';

@Injectable()
export class RankService {
  constructor(
    @InjectRepository(BUser)
    private readonly bUserRepository: Repository<BUser>,
    @InjectRepository(MUser)
    private readonly mUserRepository: Repository<MUser>,
    @InjectRepository(BRecord)
    private readonly bRecordRepository: Repository<BRecord>,
    @InjectRepository(MRecord)
    private readonly mRecordRepository: Repository<MRecord>,
  ) {}

  // 승리 기록 쿼리
  private async getWinCount(repository: Repository<any>, recordRepository: Repository<any>, mode: boolean) {
    const query = repository
      .createQueryBuilder('user')
      .leftJoin(recordRepository.metadata.tableName, 'record', `
        user.nickname = record.winner
      `)
      .select('user.nickname', 'nickname')
      .addSelect('COUNT(record.winner)', 'TotalWins')
      .groupBy('user.nickname');

    const results = await query.getRawMany();
    return results.map(record => ({
      nickname: record.nickname,
      TotalWins: Number(record.TotalWins || 0),
    }));
  }

  // 패배 기록 쿼리
  private async getLoseCount(repository: Repository<any>, recordRepository: Repository<any>, mode: boolean) {
    const query = repository
      .createQueryBuilder('user')
      .leftJoin(recordRepository.metadata.tableName, 'record', `
        user.nickname = record.loser
      `)
      .select('user.nickname', 'nickname')
      .addSelect('COUNT(record.loser)', 'TotalLoses')
      .groupBy('user.nickname');

    const results = await query.getRawMany();
    return results.map(record => ({
      nickname: record.nickname,
      TotalLoses: Number(record.TotalLoses || 0),
    }));
  }

  // 랭킹 데이터 생성
  private createResultArray(rankdb, recordWin, recordLose, mode: boolean) {
    return rankdb.map(user => {
      const wins = recordWin.find(record => record.nickname === user.nickname)?.TotalWins || 0;
      const losses = recordLose.find(record => record.nickname === user.nickname)?.TotalLoses || 0;

      const totalBScore = Math.round(user.bScore * 100) / 100 +
        ((user.records > (mode ? 20 : 15) ? (mode ? 20 : 15) : user.records) * RECORD_SCORE);

      return {
        nickname: user.nickname,
        RScore: user.rScore,
        LScore: user.lScore,
        BScore: totalBScore,
        wins,
        losses,
        clan: mode ? user.clan : null,
        Elo: user.bScore,
        TScore: totalBScore + (user.lScore * 0.4),
      };
    });
  }

  // b_user 랭킹 데이터 가져오기
  async getRankDataB() {
    const rankdb = await this.bUserRepository.find({ where: { nickname: Not('admin') } });
    const [recordWin, recordLose] = await Promise.all([
      this.getWinCount(this.bUserRepository, this.bRecordRepository, false),
      this.getLoseCount(this.bUserRepository, this.bRecordRepository, false),
    ]);

    return this.createResultArray(rankdb, recordWin, recordLose, false);
  }

  // m_user 랭킹 데이터 가져오기
  async getRankDataM() {
    const rankdb = await this.mUserRepository.find({ where: { nickname: Not('admin_m') } });
    const [recordWin, recordLose] = await Promise.all([
      this.getWinCount(this.mUserRepository, this.mRecordRepository, true),
      this.getLoseCount(this.mUserRepository, this.mRecordRepository, true),
    ]);

    return this.createResultArray(rankdb, recordWin, recordLose, true);
  }

  async challengeRank(username: string, nickname: string, mode: boolean): Promise<void> {
    const repository = mode ? this.mUserRepository : this.bUserRepository;
    const user = await repository.findOne({ where: { nickname: username } });
    if (!user) throw new HttpException('사용자를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    
    user.challenge = nickname;
    user.challengeDate = new Date();
    await (repository as Repository<BUser | MUser>).save(user);
  }

  async getChallengeData(username: string, mode: boolean): Promise<any[]> {
    const repository = mode ? this.mUserRepository : this.bUserRepository;
  
    // 사용자 이름과 관련된 도전 데이터를 리스트로 조회
    const users = await repository.find({
      where: { challenge: username }, // 필요한 조건
    });
  
  
    // 필요한 데이터만 추출하여 리스트로 반환
    return users.map(user => ({
      nickname: user.nickname,
      challengeDate: user.challengeDate,
    }));
  }
}
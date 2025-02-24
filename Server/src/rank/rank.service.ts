import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BUser } from '../entities/b-user.entity';
import { MUser } from '../entities/m-user.entity';
import { BRecord } from '../entities/b-record.entity';
import { MRecord } from '../entities/m-record.entity';
import { RECORD_SCORE } from '../config/constants';
import { ZUser } from 'src/entities/z-user.entity';
import { ZRecord } from 'src/entities/z-record.entity';

@Injectable()
export class RankService {
  constructor(
    @InjectRepository(BUser)
    private readonly bUserRepository: Repository<BUser>,
    @InjectRepository(MUser)
    private readonly mUserRepository: Repository<MUser>,
    @InjectRepository(ZUser)
    private readonly zUserRepository: Repository<ZUser>,
    @InjectRepository(BRecord)
    private readonly bRecordRepository: Repository<BRecord>,
    @InjectRepository(MRecord)
    private readonly mRecordRepository: Repository<MRecord>,
    @InjectRepository(ZRecord)
    private readonly zRecordRepository: Repository<ZRecord>,
  ) {}

  async memoModify(admin:string[], nickname:string, mode:string, memo:string) {   
    let userRepository:any

    if (!admin.includes(mode))
    {throw new HttpException("권한이 없습니다", HttpStatus.FORBIDDEN)}

    if (mode==="babapk")
    {userRepository = this.bUserRepository}
    else if (mode==="mpk")
    {userRepository = this.mUserRepository}
    else if (mode==="zpke")
    {userRepository = this.zUserRepository}
    else
    {throw new HttpException("잘못된 요청입니다", HttpStatus.BAD_REQUEST)}
    console.log(nickname, mode, memo)
    const user = await userRepository.findOne({where: {nickname}})
    
    if (!user)
    {throw new HttpException("사용자가 없습니다", HttpStatus.NOT_FOUND)}

    user.memo = memo
    await userRepository.save(user);

    return user
  }
  

  // 승리 기록 쿼리
  private async getWinCount(repository: Repository<any>, recordRepository: Repository<any>, mode: string) {
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
  private async getLoseCount(repository: Repository<any>, recordRepository: Repository<any>, mode: string) {
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
  private createResultArray(rankdb, recordWin, recordLose, mode: string) {
    return rankdb.map(user => {
      const wins = recordWin.find(record => record.nickname === user.nickname)?.TotalWins || 0;
      const losses = recordLose.find(record => record.nickname === user.nickname)?.TotalLoses || 0;

      const totalBScore = Math.round(user.bScore * 100) / 100 +
        (user.records > 20 ? 20 * RECORD_SCORE : user.records * RECORD_SCORE);

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
        memo: user.memo
      };
    });
  }

  // b_user 랭킹 데이터 가져오기
  async getRankDataB() {
    const rankdb = await this.bUserRepository
    .createQueryBuilder('user')
    .where('user.nickname != :nickname', { nickname: 'admin' })
    .andWhere('(user.records + user.lScore) > 0')
    .getMany();

    const [recordWin, recordLose] = await Promise.all([
      this.getWinCount(this.bUserRepository, this.bRecordRepository, "babapk"),
      this.getLoseCount(this.bUserRepository, this.bRecordRepository, "babapk"),
    ]);

    return this.createResultArray(rankdb, recordWin, recordLose, "babapk");
  }

  // m_user 랭킹 데이터 가져오기
  async getRankDataM() {
    const rankdb = await this.mUserRepository
    .createQueryBuilder('user')
    .where('user.nickname != :nickname', { nickname: 'admin_m' })
    .andWhere('(user.records + user.lScore) > 0')
    .getMany();
    const [recordWin, recordLose] = await Promise.all([
      this.getWinCount(this.mUserRepository, this.mRecordRepository, "mpk"),
      this.getLoseCount(this.mUserRepository, this.mRecordRepository, "mpk"),
    ]);

    return this.createResultArray(rankdb, recordWin, recordLose, "mpk");
  }

    // z_user 랭킹 데이터 가져오기
    async getRankDataZ() {
      const rankdb = await this.zUserRepository
      .createQueryBuilder('user')
    .where('user.nickname != :nickname', { nickname: 'admin_z' })
    .andWhere('(user.records + user.lScore) > 0')
    .getMany();
    
      const [recordWin, recordLose] = await Promise.all([
        this.getWinCount(this.zUserRepository, this.zRecordRepository, "zpke"),
        this.getLoseCount(this.zUserRepository, this.zRecordRepository, "zpke"),
      ]);
  
      return this.createResultArray(rankdb, recordWin, recordLose, "zpke");
    }
  




  async challengeRank(username: string, nickname: string, mode: string): Promise<void> {
    const repository = mode==="mpk" ? this.mUserRepository : this.zUserRepository;
    const user = await repository.findOne({ where: { nickname: username } });
    if (!user) throw new HttpException('사용자를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    
    user.challenge = nickname;
    user.challengeDate = new Date();
    await (repository as Repository<ZUser | MUser>).save(user);
  }

  async getChallengeData(username: string, mode: string): Promise<any[]> {
    const repository = mode==="mpk" ? this.mUserRepository : this.zUserRepository;
  
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
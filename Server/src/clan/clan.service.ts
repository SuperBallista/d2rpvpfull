import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BClan } from '../entities/b-clan.entity';
import { BUser } from '../entities/b-user.entity';
import { START_CLAN_SCORE_B } from 'src/config/constants';

@Injectable()
export class ClanService {
  constructor(
    @InjectRepository(BClan) private clanRepository: Repository<BClan>,
    @InjectRepository(BUser) private userRepository: Repository<BUser>,
    private dataSource: DataSource,
  ) {}

  async clanListService(): Promise<string[]> {
    const rawResult = await this.dataSource.query(`
SELECT 
  b_clan.*, 
  GROUP_CONCAT(user.Nickname) AS members,
  SUM(CASE WHEN user.Records > 20 THEN 20 ELSE user.Records END ) AS records
FROM 
  b_clan
LEFT JOIN 
  b_user AS user
ON 
  b_clan.name = user.clan
GROUP BY 
  b_clan.name
    `);
      return rawResult.map((row) => ({
      clan: row.clan,
      BScore: row.BScore,
      LScore: row.LScore,
      name: row.name,
      members: row.members ? row.members.split(',') : [],
      TScore: Number(row.BScore) + Number(row.LScore) + (Number(row.records) > 100? 100:Number(row.records))*4
    }));
  }

  async getMyClanService(nickname:string)
{
const user = await this.userRepository.findOne({where: {nickname : nickname}})
return JSON.stringify(user.clan)
}

  async clanJoinService(nickname: string, clan: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { nickname } });

    if (user?.clan === 'none') {
      user.clan = clan
      await this.userRepository.save(user);
    }
    else {
      throw new HttpException('클랜은 중복 가입이 불가합니다', HttpStatus.CONFLICT)
    }
  }

  async clanResetService(nickname: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { nickname } });
    if (!user) {
      throw new HttpException('유저를 찾을 수 없습니다', HttpStatus.NOT_FOUND)
    };
    user.clan = "none";
    await this.userRepository.save(user);
  }

  async adminClanScoreService(clan: string, clanScore: number): Promise<void> {
    const clanEntity = await this.clanRepository.findOne({ where: { name: clan } });

    if (!clanEntity) {
throw new HttpException('해당 클랜이 없습니다', HttpStatus.NOT_FOUND)
    }

    clanEntity.Lscore += clanScore;
    await this.clanRepository.save(clanEntity);
  }

  async clanRemoveService(clan: string): Promise<void> {
    const clanEntity = await this.clanRepository.findOne({ where: { name: clan } });


    if (!clanEntity) {
      throw new HttpException('해당 클랜을 찾을 수 없습니다', HttpStatus.NOT_FOUND)
    }

    await this.clanRepository.remove(clanEntity);
  }

  async clanCreateService(clan: string): Promise<void> {
    const existingClan = await this.clanRepository.findOne({ where: { name: clan } });

  
    if (existingClan) {
      throw new HttpException('클랜 이름이 중복됩니다!', HttpStatus.CONFLICT)
    }

    const newClan = this.clanRepository.create({ name: clan, Bscore: START_CLAN_SCORE_B });
    await this.clanRepository.save(newClan);
  }
}

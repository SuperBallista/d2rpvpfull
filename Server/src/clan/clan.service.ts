import { Injectable } from '@nestjs/common';
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
  SUM(user.Records) AS records
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
      TScore: Number(row.BScore) + Number(row.LScore) + (Number(row.records) > 20? 20:Number(row.records))*4
    }));
  }

  async getMyClanService(nickname:string)
{
const user = await this.userRepository.findOne({where: {nickname : nickname}})
return user.clan
}

  async clanJoinService(nickname: string, clan: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { nickname } });

    if (user?.clan === 'none') {
      user.clan = clan
      await this.userRepository.save(user);
      return 'ok';
    }
    return 'error';
  }

  async clanResetService(nickname: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { nickname } });
    if (!user) return 'error';

    user.clan = "none";
    await this.userRepository.save(user);
    return 'ok';
  }

  async adminClanScoreService(clan: string, clanScore: number): Promise<string> {
    const clanEntity = await this.clanRepository.findOne({ where: { name: clan } });

    if (!clanEntity) {
      return 'error';
    }

    clanEntity.Lscore += clanScore;
    await this.clanRepository.save(clanEntity);
    return 'ok';
  }

//   async createClanObject(clans: MClan[], playerdb: MUser[]): Promise<any[]> {
//     return clans.map((clan) => {
//       const members = playerdb.filter((player) => player.clan?.name === clan.name);
//       return {
//         ...clan,
//         members: members.map((member) => member.nickname),
//         wins: 0, // 계산 로직 추가
//         loses: 0, // 계산 로직 추가
//         draws: 0, // 계산 로직 추가
//       };
//     });
//   }

//   async clanRecordService(): Promise<any[]> {
//     const records = await this.clanRecordRepository.find();
//     // 추가적인 포맷 로직 필요
//     return records;
//   }

//   async clanRecordDeleteService(orderNumber: number): Promise<string> {
//     const record = await this.clanRecordRepository.findOne({ where: { orderNumber } });

//     if (!record) {
//       return 'Record not found';
//     }

//     await this.clanRecordRepository.remove(record);
//     return 'ok';
//   }

//   async clanRecordSubmitService(
//     loser: string,
//     winner: string,
//     result: boolean,
//   ): Promise<string> {
//     const loserClan = await this.userRepository.findOne({ where: { nickname: loser } });
//     const winnerClan = await this.userRepository.findOne({ where: { nickname: winner } });

//     if (!loserClan || !winnerClan || loserClan.clan === winnerClan.clan) {
//       return 'no clan error';
//     }

//     const tempRecord = this.clanRecordTempRepository.create({
//       winner,
//       loser,
//       gameDate: new Date(),
//     });
//     await this.clanRecordTempRepository.save(tempRecord);

//     return 'ok';
//   }

//   async clanNoApprovedRecordsService(user: string): Promise<any[]> {
//     const records = await this.clanRecordTempRepository.find({
//       where: [{ winner: user }, { draw1: user }],
//     });

//     return records.map((record) => ({
//       ...record,
//       result: record.winner ? 'win' : 'draw',
//     }));
//   }

//   async clanRecordCancelService(orderNumber: number): Promise<string> {
//     const record = await this.clanRecordTempRepository.findOne({ 
//       where: { orderNumber }  // order_num -> orderNumber
//     });

//     if (!record) {
//       return 'Record not found';
//     }

//     await this.clanRecordTempRepository.remove(record);
//     return 'ok';
//   }

//   async clanRecordAcceptService(orderNumber: number, result: string): Promise<string> {
//     const tempRecord = await this.clanRecordTempRepository.findOne({
//       where: { orderNumber },
//     });

//     if (!tempRecord) {
//       return 'Record not found';
//     }

//     const clanRecord = this.clanRecordRepository.create({
//       winner: tempRecord.winner,
//       loser: tempRecord.loser,
//       draw1: tempRecord.draw1,
//       draw2: tempRecord.draw2,
//       gameDate: tempRecord.gameDate,
//     });

//     await this.clanRecordRepository.save(clanRecord);
//     await this.clanRecordTempRepository.remove(tempRecord);

//     return 'ok';
//   }

  async clanRemoveService(clan: string): Promise<string> {
    const clanEntity = await this.clanRepository.findOne({ where: { name: clan } });

    if (!clanEntity) {
      return 'Clan not found';
    }

    await this.clanRepository.remove(clanEntity);
    return 'ok';
  }

  async clanCreateService(clan: string): Promise<string> {
    const existingClan = await this.clanRepository.findOne({ where: { name: clan } });

    if (existingClan) {
      return 'Clan already exists';
    }

    const newClan = this.clanRepository.create({ name: clan, Bscore: START_CLAN_SCORE_B });
    await this.clanRepository.save(newClan);
    return 'ok';
  }
}

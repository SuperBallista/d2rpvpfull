import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BUser } from 'src/entities/b-user.entity';
import { MUser } from 'src/entities/m-user.entity';
import { ZUser } from 'src/entities/z-user.entity';
import { Account } from 'src/entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { START_SCORE, START_SCORE_M, START_SCORE_Z } from 'src/config/constants';
import * as bcrypt from 'bcrypt';


@Injectable()
export class ConnectService {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(BUser)
        private readonly bUserRepository: Repository<BUser>,
        @InjectRepository(MUser)
        private readonly mUserRepository: Repository<MUser>,
        @InjectRepository(ZUser)
        private readonly zUserRepository: Repository<ZUser>,
        @InjectRepository(Account)
        private readonly AccountRepository: Repository<Account>
       ) {}
        

    
  async processLogin(body: any, username: string): Promise<any> {
    const { nickname, password, mode } = body;

    let lowerCaseNickname:string
    let UserRepository

    const UnionUser = await this.AccountRepository.findOne({where: {account: username}})

    if (mode === "mpk") {
     lowerCaseNickname = nickname.toLowerCase()+"_m"  
     UserRepository = this.mUserRepository
    }
    else if (mode === "zpke") {
     lowerCaseNickname = nickname.toLowerCase()+"_z"
     UserRepository = this.zUserRepository
    }
    else if (mode === "babapk") {
      lowerCaseNickname = nickname.toLowerCase()
      UserRepository = this.bUserRepository
    }
  
    const user = await UserRepository.findOne({
      where: { nickname: lowerCaseNickname },
    });
  
    if (!user || !UnionUser) {
      throw new HttpException('사용자를 찾을 수 없습니다.', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(password, user.pw);
    if (!isPasswordValid) {
      throw new HttpException('비밀번호가 일치하지 않습니다.', HttpStatus.UNAUTHORIZED);
    }

    user.pw = ""
    if (mode === "babapk") {
        UnionUser.babapk = lowerCaseNickname
    } else if (mode === "mpk") {
        UnionUser.mpk = lowerCaseNickname
    } else if (mode === "zpke") {
        UnionUser.zpke = lowerCaseNickname
    }
    await UserRepository.save(user)
    await this.AccountRepository.save(UnionUser)
    return {nickname: lowerCaseNickname};
  }

  
  async processNew(body: any, res: any, account: string) {
    const { nickname, mode } = body;

    const lowerCaseNickname = nickname.toLowerCase();
    const userData = await this.AccountRepository.findOne({where: {account}})
       
    let user
    let UserRepository
    if (mode === "babapk")
    {
    UserRepository = this.bUserRepository;
    userData.babapk = nickname
    user = new BUser();
    user.nickname = lowerCaseNickname;
    user.bScore = START_SCORE;
    user.lScore = 0;
  }
  if (mode === "mpk")
    {
    UserRepository = this.mUserRepository;
    userData.mpk = nickname
    user = new MUser();
    user.nickname = lowerCaseNickname;
    user.bScore = START_SCORE_M;
    user.lScore = 0;
  }
  if (mode === "zpke")
    {
    UserRepository = this.zUserRepository;
    userData.zpke = nickname
    user = new ZUser();
    user.nickname = lowerCaseNickname;
    user.bScore = START_SCORE_Z;
    user.lScore = 0;
  }
  
    await UserRepository.save(user);
    await this.AccountRepository.save(userData);

    return res.json({ success: true, message: '캐릭터 추가가 완료되었습니다.' });
  }

  async deleteCharactor(
    userNickname: string,
    nickname: string,
    mode: string
  ): Promise<{ success: boolean; error?: string; status?: number }> {
  
    let repository
  
    if (mode === "babapk")
    {repository = this.bUserRepository}
    else if (mode === "mpk")
    {repository = this.mUserRepository}
    else if (mode === "zpke")
    {repository = this.zUserRepository}
  
  
    const user = await repository.findOne({ where: { nickname: nickname } });
    if (!user) {
      return {
        success: false,
        error: '사용자를 찾을 수 없습니다.',
        status: HttpStatus.NOT_FOUND,
      };
    }
   const userData =  await this.AccountRepository.findOne({where: {account: userNickname} });
  
   if (mode === "babapk")
  {userData.babapk = ""}
   else if (mode === "mpk")
    {userData.mpk = ""}
   else if (mode === "zpke")
    {userData.zpke = ""} 
   
   await this.AccountRepository.save(userData);  
   const deleteResult = await repository.delete({ nickname: nickname });
    
    if (deleteResult.affected === 1) {
      return { success: true };
    } else {
      return {
        success: false,
        error: '계정 삭제에 실패했습니다.',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
  


}



import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { jwtService } from '../jwt/jwt.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { BUser } from '../entities/b-user.entity';
import { MUser } from '../entities/m-user.entity';
import { ConfigService } from '@nestjs/config';
import { ZUser } from 'src/entities/z-user.entity';
import { START_SCORE, START_SCORE_Z, START_SCORE_M } from 'src/config/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: jwtService,
    private readonly configService: ConfigService,
    @InjectRepository(BUser)
    private readonly bUserRepository: Repository<BUser>,
    @InjectRepository(MUser)
    private readonly mUserRepository: Repository<MUser>,
    @InjectRepository(ZUser)
    private readonly zUserRepository: Repository<ZUser>
   ) {}


  async deleteAccount(
    userNickname: string,
    nowpw: string,
    tableName: 'b_user' | 'm_user' | 'z_user',
  ): Promise<{ success: boolean; error?: string; status?: number }> {
    let repository
    if (tableName === 'b_user')
    {repository = this.bUserRepository}
    else if (tableName === 'm_user')
    {repository = this.mUserRepository}
    else
    {repository = this.zUserRepository}

    const user = await repository.findOne({ where: { nickname: userNickname } });
    if (!user) {
      return {
        success: false,
        error: '사용자를 찾을 수 없습니다.',
        status: HttpStatus.NOT_FOUND,
      };
    }

    const isPasswordValid = await bcrypt.compare(nowpw, user.pw);
    if (!isPasswordValid) {
      return {
        success: false,
        error: '현재 암호가 일치하지 않습니다.',
        status: HttpStatus.UNAUTHORIZED,
      };
    }

    const deleteResult = await repository.delete({ nickname: userNickname });
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


  async processLogin(body: any, mode: string): Promise<any> {
    const { nickname, password } = body;

    let lowerCaseNickname:string
    let UserRepository

    if (mode === "m_user") {
     lowerCaseNickname = nickname.toLowerCase()+"_m"  
     UserRepository = this.mUserRepository
    }
    else if (mode === "z_user") {
     lowerCaseNickname = nickname.toLowerCase()+"_z"
     UserRepository = this.zUserRepository
    }
    else{
      lowerCaseNickname = nickname.toLowerCase()
      UserRepository = this.bUserRepository
    }
  
    const user = await UserRepository.findOne({
      where: { nickname: lowerCaseNickname },
    });
  
    if (!user) {
      throw new HttpException('사용자를 찾을 수 없습니다.', HttpStatus.UNAUTHORIZED);
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.pw);
    if (!isPasswordValid) {
      throw new HttpException('비밀번호가 일치하지 않습니다.', HttpStatus.UNAUTHORIZED);
    }
  
    //  엑세스토큰 생성, 리프레시토큰 생성 및 저장은 컨트롤러영역에서 따로 지정
    const token = this.jwtService.createAccessToken(lowerCaseNickname);
    const refreshToken = this.jwtService.createRefreshToken(lowerCaseNickname);

     
    return {
      username: lowerCaseNickname,
      accessToken: token,
      refreshToken: refreshToken
    };
  }
  
  async processRegi(body: any, res: any) {
    const { nickname, password, email, wgrade } = body;

    const lowerCaseNickname = nickname.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new BUser();
    user.nickname = lowerCaseNickname;
    user.pw = hashedPassword;
    user.email = email;
    user.bScore = START_SCORE;
    user.lScore = 0;
    user.class = wgrade;
    user.lastgame = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));

    await this.bUserRepository.save(user);

    return res.json({ success: true, message: '회원가입이 완료되었습니다.' });
  }

  async processRegiM(body: any, res: any) {
    const { nickname, password, email, wgrade } = body;

    const lowerCaseNickname = `${nickname.toLowerCase()}_m`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new MUser();
    user.nickname = lowerCaseNickname;
    user.pw = hashedPassword;
    user.email = email;
    user.bScore = START_SCORE_M;
    user.lScore = 0;
    user.class = wgrade;

    await this.mUserRepository.save(user);

    return res.json({ success: true, message: '회원가입이 완료되었습니다.' });
  }


  async processRegiZ(body: any, res: any) {
    const { nickname, password, email, wgrade } = body;

    const lowerCaseNickname = `${nickname.toLowerCase()}_z`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new ZUser();
    user.nickname = lowerCaseNickname;
    user.pw = hashedPassword;
    user.email = email;
    user.bScore = START_SCORE_Z;
    user.lScore = 0;
    user.class = wgrade;

    await this.zUserRepository.save(user);

    return res.json({ success: true, message: '회원가입이 완료되었습니다.' });
  }




  async processNicknameCheck(body: any, res: any) {
    const { nickname } = body;

    const user = await this.bUserRepository.findOne({ where: { nickname } });
    if (user) {
      return res.status(403).json({ error: '중복된 닉네임입니다.' });
    }

    return res.status(200).json({ message: '사용 가능한 닉네임입니다.' });
  }

  async processNicknameCheckM(body: any, res: any) {
    const { nickname } = body;

    const lowerCaseNickname = `${nickname.toLowerCase()}_m`;
    const user = await this.mUserRepository.findOne({
      where: { nickname: lowerCaseNickname },
    });
    if (user) {
      return res.status(403).json({ error: '중복된 닉네임입니다.' });
    }

    return res.status(200).json({ message: '사용 가능한 닉네임입니다.' });
  }

  async processNicknameCheckZ(body: any, res: any) {
    const { nickname } = body;

    const lowerCaseNickname = `${nickname.toLowerCase()}_z`;
    const user = await this.zUserRepository.findOne({
      where: { nickname: lowerCaseNickname },
    });
    if (user) {
      return res.status(403).json({ error: '중복된 닉네임입니다.' });
    }

    return res.status(200).json({ message: '사용 가능한 닉네임입니다.' });
  }



  async checkJwt(req: any, res: any, username: string) {
    
    if (!req.user) {
      return res.status(200).json({ authenticated: false });
    }
    const token = this.jwtService.createAccessToken(username);

    let mode
    if (username.includes("_m")){
      mode = "mpk"
    } else if (username.includes("_z")){
      mode = "zpke"
    } else {
      mode = "babapk"
    }

    return res.status(200).json({ authenticated: true, username: username, token: token, mode: mode });
  }
}

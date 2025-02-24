import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { jwtService } from 'src/jwt/jwt.service';
import { Account } from 'src/entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BABAPK_ADMIN, MPK_ADMIN, ZPKE_ADMIN } from 'src/config/constants';

interface Request extends ExpressRequest {
  user?: any;
}



@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: jwtService,
    @InjectRepository(Account)
    private readonly AccountRepository: Repository<Account>

  ) {}
  
  async use(req: Request, res: Response, next: NextFunction) {



    if (req.method === 'GET') {
      return next(); // GET 요청은 미들웨어 통과
    }
    

    

    const findNickname = async (account: string, mode: string): Promise<string> => {
      const userDB = await this.AccountRepository.findOne({ where: { account } });
      let result
      if (mode === "babapk") {result = userDB.babapk}
      else if (mode === "mpk") {result = userDB.mpk}
      else if (mode === "zpke") {result = userDB.zpke};
      return result;
    }

    const accessToken = req.headers['d2rpvpjwttoken'] as string; // 요청 헤더의 액세스 토큰
    const refreshToken = req.cookies['d2rpvprefreshToken']; // 쿠키의 리프레시 토큰
    let admin: string[] = []

    if (accessToken) {
      try {
        // 액세스 토큰 검증
        const decoded = await this.jwtService.verifyAccessToken(accessToken);
       const username = await findNickname(decoded.username, req.headers['mode'] as string)
       if (!username) {
        console.warn('계정을 생성하지 않은 사용자입니다')
       }
       if (BABAPK_ADMIN.includes(decoded.username))
        {admin.push("babapk")}          
       if (MPK_ADMIN.includes(decoded.username))
        {admin.push("mpk")}          
       if (ZPKE_ADMIN.includes(decoded.username))
        {admin.push("zpke")} 
        req.user = { username: username, account: decoded.username, admin: admin }; // 사용자 정보 설정
        
        return next(); // 요청 흐름 계속
      } catch (error) {
        console.warn('Invalid or expired access token:', error.message);
      }
    }

    else if (refreshToken) {
      try {
        // 리프레시 토큰 검증 및 새 액세스 토큰 생성
        const decoded = await this.jwtService.verifyRefreshToken(refreshToken);
        const newAccessToken = await this.jwtService.createAccessToken(decoded.username);

        // 새 액세스 토큰을 응답 헤더에 설정
        res.setHeader('d2rpvpjwttoken', newAccessToken);
        res.setHeader('Access-Control-Expose-Headers', 'd2rpvpjwttoken');
        const username = await findNickname(decoded.username, req.headers['mode'] as string)
        if (!username) {
         console.warn('계정을 생성하지 않은 사용자입니다')
        }
         if (BABAPK_ADMIN.includes(decoded.username))
          {admin.push("babapk")}          
         if (MPK_ADMIN.includes(decoded.username))
          {admin.push("mpk")}          
         if (ZPKE_ADMIN.includes(decoded.username))
          {admin.push("zpke")} 
         req.user = { username: username, account: decoded.username, admin: admin }; // 사용자 정보 설정
        console.log('New access token generated and set in header');
      } catch (error) {
        console.error('Invalid refresh token:', error.message);
      }
    }

    // 토큰이 없거나 유효하지 않으면 다음 단계로 진행
    if (!req.user) {
      console.warn('Unauthorized request: no valid tokens');
      return new HttpException('권한이 없습니다.', HttpStatus.UNAUTHORIZED);
    }

    next();
  }
}

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { Account } from 'src/entities/account.entity';

interface ResetPasswordResult {
  success: boolean;
  error?: string;
  status?: number;
}

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectRepository(Account)
    private readonly AccountRepository: Repository<Account>
  ) {}

  // 임시 비밀번호 생성 함수
  private generateRandomPassword(length: number): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  // 이메일 전송 함수
  private async sendEmail(email: string, password: string): Promise<void> {
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'D2R PvP 임시 암호',
      text: `임시 암호: ${password}`,
    };

    const transporter = nodemailer.createTransport({
      host: 'smtp.naver.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PW,
      },
    });

    await transporter.sendMail(mailOptions);
  }

  // 비밀번호 재설정 로직
  async resetPassword(nickname: string,email: string): Promise<ResetPasswordResult> {
    let repository = this.AccountRepository

    try {
      // 사용자 이메일 조회
      const user = await repository.findOne({ where: { account: nickname } });

      if (!user) {
        throw new HttpException('사용자를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      }

      if (user.email !== email) {
        throw new HttpException('이메일이 일치하지 않습니다.', HttpStatus.UNAUTHORIZED);
      }

      // 임시 비밀번호 생성
      const temporaryPassword = this.generateRandomPassword(10);
      const temporaryPasswordHash = await bcrypt.hash(temporaryPassword, 10);

      // 비밀번호 업데이트
      user.password = temporaryPasswordHash;
        await (repository as Repository<Account>).save(user);

      // 이메일 전송
      await this.sendEmail(email, temporaryPassword);

      return { success: true };
    } catch (error) {
      console.error('비밀번호 재설정 오류:', error);
      throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

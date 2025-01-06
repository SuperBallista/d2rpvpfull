import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { BEventRecord } from '../entities/b-eventrecord.entity';
import { BUser } from '../entities/b-user.entity';
import { MEventRecord } from '../entities/m-eventrecord.entity';
import { MUser } from '../entities/m-user.entity';
import { ZEventRecord } from 'src/entities/z-eventrecord.entity';
import { ZUser } from 'src/entities/z-user.entity';
import {
  TEAMS_SCORES_B, TEAMS_SCORES_M, TEAMS_SCORES_Z, EVENT_HOST_SCORE,
} from '../config/constants';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(BEventRecord)
    private readonly bEventRecordRepository: Repository<BEventRecord>,
    @InjectRepository(BUser)
    private readonly bUserRepository: Repository<BUser>,
    @InjectRepository(MEventRecord)
    private readonly mEventRecordRepository: Repository<MEventRecord>,
    @InjectRepository(MUser)
    private readonly mUserRepository: Repository<MUser>,
    @InjectRepository(ZEventRecord)
    private readonly zEventRecordRepository: Repository<ZEventRecord>,
    @InjectRepository(ZUser)
    private readonly zUserRepository: Repository<ZUser>,
    private readonly entityManager: EntityManager,
  ) {}

  async submitEvent(eventData: Record<string, any>, mode:string): Promise<void> {
let repository
if (mode === "babapk")
{repository = this.bEventRecordRepository}
else if (mode === "mpk")
{repository = this.mEventRecordRepository}
else
{repository = this.zEventRecordRepository}
  
    try {
      // 데이터 변환 및 기본값 설정
      const eventRecord = repository.create({
        ...eventData,
        numberteams: parseInt(eventData.numberteams, 10) || 0,
        teamSize: parseInt(eventData.teamSize, 10) || 1,
        accept: 1,
      });
  
      // 유효성 검사
      if (!eventRecord.eventname || !eventRecord.Eventhost) {
        throw new HttpException('필수 데이터가 누락되었습니다.', HttpStatus.BAD_REQUEST);
      }
  
      // 데이터 저장
      await repository.save(eventRecord);
    } catch (error) {
      console.error('이벤트 제출 오류:', error);
      throw new HttpException(
        '이벤트 제출에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  async getEventHistory(mode: string): Promise<any[]> {
    let repository
    if (mode === "babapk")
    {repository = this.bEventRecordRepository}
    else if (mode === "mpk")
    {repository = this.mEventRecordRepository}
    else
    {repository = this.zEventRecordRepository}
    try {
      return await repository.find({ order: { orderNum: 'DESC' } });
    } catch (error) {
      console.error('이벤트 히스토리 가져오기 오류:', error);
      throw new HttpException(
        '이벤트 히스토리를 가져오는데 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteEvent(eventname: string, mode: string): Promise<void> {
    let repository
    if (mode === "babapk")
    {repository = this.bEventRecordRepository}
    else if (mode === "mpk")
    {repository = this.mEventRecordRepository}
    else
    {repository = this.zEventRecordRepository}

    try {
      const deleteResult = await repository.delete({ eventname });
      if (!deleteResult.affected) {
        throw new HttpException('이벤트를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      console.error('이벤트 삭제 오류:', error);
      throw new HttpException(
        '이벤트 삭제에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async acceptEvent(eventData: any, mode: string): Promise<void> {
    let userRepository
    let scores
    let repository

    if (mode === "babapk")
    {userRepository = this.bUserRepository
      repository = this.bEventRecordRepository
      scores = TEAMS_SCORES_B
    }
    else if (mode === "mpk")
    {userRepository = this.mUserRepository
      repository = this.mEventRecordRepository
      scores = TEAMS_SCORES_M
    }
    else if (mode === "zpke")
    {userRepository = this.zUserRepository
      repository = this.zEventRecordRepository
      scores = TEAMS_SCORES_Z
    }
  
    try {
      await this.entityManager.transaction(async (manager) => {
        const {
          eventname,
          Championship1,
          Championship2,
          Championship3,
          Championship4,
          Runner_up1,
          Runner_up2,
          Runner_up3,
          Runner_up4,
          Place3rd1,
          Place3rd2,
          Place3rd3,
          Place3rd4,
          numberteams,
          Eventhost,
        } = eventData;
  
        // 참가자의 점수를 업데이트하는 함수
        const updateScore = async (
          participants: string[],
          scoreType: keyof typeof scores,
          position: keyof typeof scores[typeof scoreType],
        ) => {
          const scoreTable = scores[scoreType]; // 해당 팀 규모의 점수 테이블
          const increment = scoreTable[position]; // 해당 포지션의 점수
  
          if (!increment) return; // 점수 정의되지 않은 경우 무시
  
          for (const participant of participants) {
            const user = await userRepository.findOne({
              where: { nickname: participant },
            });
  
            if (user) {
              user.lScore = (user.lScore || 0) + increment;
              await manager.save(user);
            }
          }
        };
  
        // 팀 규모에 따라 점수 업데이트
        const scoreType = `teams${numberteams}` as keyof typeof scores;
        if (scores[scoreType]) {
          // 모든 우승팀원의 점수 업데이트
          await updateScore(
            [Championship1, Championship2, Championship3, Championship4].filter(Boolean), // null/undefined 제거
            scoreType,
            'Championship',
          );
  
          // 모든 준우승팀원의 점수 업데이트
          await updateScore(
            [Runner_up1, Runner_up2, Runner_up3, Runner_up4].filter(Boolean), // null/undefined 제거
            scoreType,
            'Runner_up',
          );
  
          // 모든 3위팀원의 점수 업데이트
          await updateScore(
            [Place3rd1, Place3rd2, Place3rd3, Place3rd4].filter(Boolean), // null/undefined 제거
            scoreType,
            'Place3rd',
          );          
        }


     
        // 이벤트 레코드 승인 업데이트
        const eventRecord = await repository.findOne({
          where: { eventname: eventname },
        });

        if (eventRecord) {
          eventRecord.accept = 2; // 승인된 상태로 업데이트
          await manager.save(eventRecord);
        }


        // 이벤트 호스트 점수
        if (mode != "zpke") {
        const user = await userRepository.findOne({
          where: { nickname: Eventhost },
        });

        if (user) {
          user.lScore = (user.lScore || 0) + EVENT_HOST_SCORE;
          await manager.save(user);
        }
      }



      });
    } catch (error) {
      console.error('이벤트 승인 오류:', error);
      throw new HttpException(
        '이벤트 승인에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



  
  async cancelAccepted(eventData: any, mode: string): Promise<void> {
    let userRepository
    let scores

    if (mode === "babapk")
    {userRepository = this.bUserRepository
     scores = TEAMS_SCORES_B
    } else if (mode === "mpk")
    {userRepository = this.mUserRepository
      scores = TEAMS_SCORES_M
    } else
      {userRepository = this.zUserRepository
        scores = TEAMS_SCORES_Z
      }
    
    try {
      await this.entityManager.transaction(async (manager) => {
        const {
          eventname,
          Championship1,
          Championship2,
          Championship3,
          Championship4,
          Runner_up1,
          Runner_up2,
          Runner_up3,
          Runner_up4,
          Place3rd1,
          Place3rd2,
          Place3rd3,
          Place3rd4,
          numberteams,
          Eventhost
        } = eventData;
  
        // 참가자의 점수를 업데이트하는 함수
        const updateScore = async (
          participants: string[],
          scoreType: keyof typeof scores,
          position: keyof typeof scores[typeof scoreType],
        ) => {
          const scoreTable = scores[scoreType]; // 해당 팀 규모의 점수 테이블
          const increment = scoreTable[position]; // 해당 포지션의 점수
  
          if (!increment) return; // 점수 정의되지 않은 경우 무시
  
          for (const participant of participants) {
            const user = await userRepository.findOne({
              where: { nickname: participant },
            });
  
            if (user) {
              user.lScore = (user.lScore || 0) - increment;
              await manager.save(user);
            }
          }
        };
  
        // 팀 규모에 따라 점수 업데이트
        const scoreType = `teams${numberteams}` as keyof typeof scores;
        if (scores[scoreType]) {
          // 모든 우승팀원의 점수 업데이트
          await updateScore(
            [Championship1, Championship2, Championship3, Championship4].filter(Boolean), // null/undefined 제거
            scoreType,
            'Championship',
          );
  
          // 모든 준우승팀원의 점수 업데이트
          await updateScore(
            [Runner_up1, Runner_up2, Runner_up3, Runner_up4].filter(Boolean), // null/undefined 제거
            scoreType,
            'Runner_up',
          );
  
          // 모든 3위팀원의 점수 업데이트
          await updateScore(
            [Place3rd1, Place3rd2, Place3rd3, Place3rd4].filter(Boolean), // null/undefined 제거
            scoreType,
            'Place3rd',
          );
        }
  
        // 승인된 이벤트 삭제
        let repository
        if (mode === "babapk")
        {repository = this.bEventRecordRepository}
        else if (mode === "mpk")
        {repository = this.mEventRecordRepository}
        else if (mode === "zpke")
        {repository = this.zEventRecordRepository}
  
        const eventRecord = await repository.findOne({
          where: { eventname },
        });
  
        if (eventRecord) {
          await manager.remove(eventRecord);
        }

        // 이벤트 호스트 점수
        if (mode != "zpke") {
          const user = await userRepository.findOne({
            where: { nickname:  Eventhost },
          });
  
          if (user) {
            user.lScore = (user.lScore || 0) - EVENT_HOST_SCORE;
            await manager.save(user);
          }
        }
  

      });
    } catch (error) {
      console.error('승인된 이벤트 취소 오류:', error);
      throw new HttpException(
        '승인된 이벤트 취소에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async modifyMemo(eventData: any): Promise<void> {
  
  let EventRecordRepository
  if (eventData.mode === "babapk")
  {EventRecordRepository = this.bEventRecordRepository}
  else if (eventData.mode === "mpk")
  {EventRecordRepository = this.mEventRecordRepository}
  else if (eventData.mode === "zpke")
  {EventRecordRepository = this.zEventRecordRepository}
  try{
   await EventRecordRepository.update(
    { eventname: eventData.eventname }, // 조건
    { memo: eventData.memotext },     // 업데이트할 필드
  );  }
  catch (error){
    throw new HttpException(
      "메모에 실패하였습니다", HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

}


}
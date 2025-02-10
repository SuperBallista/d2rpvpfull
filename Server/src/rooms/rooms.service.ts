import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entities/room.entity';
import { RoomAccessLog } from '../entities/roomAccessLog.entity';

export interface RoomWithViews {
    id: number;
    mode: 'babapk' | 'mpk' | 'zpke';
    room_name: string;
    views: number; // 추가된 속성
  }

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(RoomAccessLog)
    private readonly roomAccessLogRepository: Repository<RoomAccessLog>,
  ) {}

  async getLatestRooms(): Promise<RoomWithViews[]> {
    const rooms = await this.roomRepository.find({
      select: ['id', 'mode', 'room_name', 'created_at'],
      order: { created_at: 'DESC' },
      take: 30,
    });
  
    // views 조회를 병렬 실행하여 성능 향상
    const roomsWithViews = await Promise.all(
      rooms.map(async (room) => ({
        ...room,
        views: await this.roomAccessLogRepository.count({ where: { room_id: room.id } }),
      }))
    );
  
    return roomsWithViews;
  }

  async getRoomPassword(id: number) {
    return await this.roomRepository.findOne({ where: { id }, select: ['room_name', 'password'] });
  }
  
  async logRoomAccess(roomId: number, userAccount: string, ipAddress: string) {
    const accessLog = this.roomAccessLogRepository.create({ room_id: roomId, user_account: userAccount, ip_address: ipAddress });
    await this.roomAccessLogRepository.save(accessLog);
  }

  async viewsRoomAccess(id: number) {
    const userList = await this.roomAccessLogRepository.query(
        `SELECT 
            a.account, 
            a.babapk, 
            a.mpk, 
            a.zpke,
            r.ip_address,
            r.access_time
        FROM account a
        INNER JOIN room_access_logs r ON a.account = r.user_account
        WHERE r.room_id = ?`, 
        [id] // SQL 바인딩
    );

    // ✅ userList가 배열인지 확인 후 ip_address 마스킹
    return userList.map(user => ({
        ...user,
        ip_address: maskIP(user.ip_address) // 🔥 개별 IP 주소 마스킹
    }));
}

  async makeNewRoom(body: any, userAccount: string, ip_address: string){
    const newRoom = await this.roomRepository.create({room_name: body.name, password:body.password, mode: body.mode})
   const madeRoom =  await this.roomRepository.save(newRoom);
    const accessLog = this.roomAccessLogRepository.create({ room_id: madeRoom.id, user_account: userAccount, ip_address: ip_address });
    await this.roomAccessLogRepository.save(accessLog);
  }
}


function maskIPv4(ip: string): string {
  return ip.replace(/\d+$/, "***"); // 마지막 숫자를 '***'로 변경
}

function maskIPv6(ip: string): string {
  const parts = ip.split(":");
  parts[parts.length - 1] = "****"; // 마지막 그룹 마스킹
  return parts.join(":");
}

function maskIP(ip: string): string {
  return ip.includes(".") ? maskIPv4(ip) : maskIPv6(ip);
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('room_access_logs')
export class RoomAccessLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  room_id: number; // FK를 DB에서 설정하지 않고 코드에서 관리

  @Column()
  user_account: string; // FK를 DB에서 설정하지 않고 코드에서 관리

  @Column({ type: 'varchar', length: 45 })
  ip_address: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  access_time: Date;
}

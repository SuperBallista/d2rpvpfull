import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('blocked_ips')
export class BlockedIp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 45 })
  ip_address: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  blocked_at: Date;
}

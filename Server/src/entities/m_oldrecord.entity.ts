import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('m_oldrecord') // Maps to the 'm_oldrecord' table in the database
export class MOldRecord {
  @PrimaryGeneratedColumn()
  orderNum: number; // PRIMARY KEY, AUTO_INCREMENT

  @Column({ type: 'date', nullable: false })
  date: Date; // Date of the record (NOT NULL)

  @Column({ length: 255, nullable: true })
  winner?: string; // Winner of the event (nullable)

  @Column({ length: 255, nullable: true })
  loser?: string; // Loser of the event (nullable)

  @Column({ length: 255, nullable: true })
  win2?: string; // Additional winner (nullable)

  @Column({ length: 255, nullable: true })
  win3?: string; // Additional winner (nullable)

  @Column({ length: 255, nullable: true })
  win4?: string; // Additional winner (nullable)

  @Column({ length: 255, nullable: true })
  lose2?: string; // Additional loser (nullable)

  @Column({ length: 255, nullable: true })
  lose3?: string; // Additional loser (nullable)

  @Column({ length: 255, nullable: true })
  lose4?: string; // Additional loser (nullable)

  @Column({ type: 'int', nullable: true })
  wScore?: number; // Winner's score (nullable)

  @Column({ type: 'int', nullable: true })
  lScore?: number; // Loser's score (nullable)
}

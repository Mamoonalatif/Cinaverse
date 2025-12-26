import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class LoginLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  user: User | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column({ type: 'varchar', nullable: true })
  ipAddress: string;

  @Column({ type: 'varchar', nullable: true })
  activity: string; // e.g. 'login', 'logout'
}

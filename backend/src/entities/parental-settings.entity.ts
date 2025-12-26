import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ParentalSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'int', default: 13 })
  minAge: number;

  @Column({ type: 'text', nullable: true })
  bannedGenres: string; // comma-separated
}

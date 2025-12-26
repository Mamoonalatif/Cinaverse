import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Watchlist {
  @PrimaryGeneratedColumn()
  id: number;


  @Column()
  movieId: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  status: string;

  @Column({ default: new Date().toISOString() })
  createdAt: string;

  @ManyToOne(() => User, (u) => u.watchlists, { onDelete: 'CASCADE' })
  user: User;
}

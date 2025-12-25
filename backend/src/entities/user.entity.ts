import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Watchlist } from './watchlist.entity';
import { Review } from './review.entity';
import { Subscription } from './subscription.entity';
import { Log } from './log.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @OneToMany(() => Watchlist, (w) => w.user)
  watchlists: Watchlist[];

  @OneToMany(() => Review, (r) => r.user)
  reviews: Review[];

  @OneToMany(() => Subscription, (s) => s.user)
  subscriptions: Subscription[];

  @OneToMany(() => Log, (l) => l.user)
  logs: Log[];
}

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Watchlist } from './watchlist.entity';
import { Review } from './review.entity';
import { Subscription } from './subscription.entity';
import { LoginLog } from './login-log.entity';
import { ApiLog } from './api-log.entity';
import { ChildProfile } from './child-profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;


  @Column()
  firstName: string;

  @Column()
  lastName: string;

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

  @OneToMany(() => LoginLog, (l) => l.user)
  loginLogs: LoginLog[];

  @OneToMany(() => ApiLog, (a) => a.user)
  apiLogs: ApiLog[];

  @OneToMany(() => ChildProfile, (childProfile) => childProfile.parent)
  childProfiles: ChildProfile[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

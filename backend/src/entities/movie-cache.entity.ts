import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MovieCache {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  movieId: string;

  @Column({ type: 'jsonb', nullable: true })
  data: any;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

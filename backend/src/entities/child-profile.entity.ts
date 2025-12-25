import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ChildProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  parent: User;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  maxAgeRating: string | null; // e.g., PG, PG-13, R

  @Column({ type: 'text', nullable: true })
  allowedGenres: string | null; // comma-separated names or ids
}

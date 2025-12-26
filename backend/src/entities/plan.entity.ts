import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('int')
  price: number; // cents

  @Column('text')
  description: string;

  // Screen-related fields (merged from Screen entity)
  @Column({ nullable: true })
  resolution: string;

  @Column({ type: 'int', nullable: true })
  maxDevices: number;

  @Column({ nullable: true })
  screenType: string;
}

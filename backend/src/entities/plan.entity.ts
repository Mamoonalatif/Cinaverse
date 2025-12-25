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
}

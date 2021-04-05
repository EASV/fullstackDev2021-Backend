import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({unique: true})
  public nickname: string;
}

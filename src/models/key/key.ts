import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'keys' })
export class Key {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  secret: string;
}

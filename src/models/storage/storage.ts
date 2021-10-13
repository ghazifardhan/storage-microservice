import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'storages' })
export class Storage {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fieldName: string;

  @Column()
  originalName: string;

  @Column()
  encoding: string;

  @Column()
  mimetype: string;

  @Column()
  destination: string;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  size: number;
}
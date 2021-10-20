import { AfterInsert, AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { env } from "../../server";

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

  @Column()
  fileUrl: string;

  @BeforeInsert()
  beforeInsertFileUrl() {
    this.fileUrl = env().APP_URL + this.id;
  }

  @AfterInsert()
  afterInsertFileUrl() {
    this.fileUrl = env().APP_URL + this.id;
  }

}
import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity
} from "typeorm";

@ObjectType()
@Entity()
export class Tecnico extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id_tecnico!: number;

  @Field()
  @Column()
  nombre_tecnico!: string;
}

import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  Unique
} from "typeorm";

@ObjectType()
@Entity()
@Unique(["email_usuario"])
export class Usuario extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id_usuario!: number;

  @Field()
  @Column()
  nombre_usuario!: string;

  @Field()
  @Column()
  email_usuario!: string;

  @Field()
  @Column()
  clave_usuario!: string;
}

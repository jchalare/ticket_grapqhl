import { Field, ObjectType } from "type-graphql";
import { Tecnico } from "./Tecnico";
import { Usuario } from './Usuario';

import {
  Entity,
  Column,
  CreateDateColumn,
  BaseEntity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,Check
} from "typeorm";

@ObjectType()
@Entity()
export class Servicio extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id_servicio!: number;

  @Field()
  @Column()
  ticket_servicio!: string;

  @Field()
  @Column()
  turno_servicio!: number;

  @Field()
  @Column()
  /*@Check(
    `"estado_servicio" = 'PENDIENTE' OR "estado_servicio" = 'EN PROCESO' OR "estado_servicio" = 'TERMINADO'`
  )*/
  estado_servicio!: string;

  @Field()
  @Column()
  /*@Check(
    `"calificacion_servicio" = 'PENDIENTE' OR "calificacion_servicio" = 'BUENO' OR "calificacion_servicio" = 'MALO'  OR "calificacion_servicio" = 'MUY BUENO'`
  )*/
  calificacion_servicio!: string;

  @Field(() => Date)
  @CreateDateColumn({ type: "date" })
  fecha_servicio?: Date;

  @Field()
  @ManyToOne((type) => Usuario)
  @JoinColumn([{ name: "id_usuario" }, { name: "id_usuario" }])
  id_usuario?: Usuario;

  @Field()
  @ManyToOne((type) => Tecnico)
  @JoinColumn([{ name: "id_tecnico" }, { name: "id_tecnico" }])
  id_tecnico?: Tecnico;
}

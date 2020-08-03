import {
  Resolver,
  ObjectType,
  Query,
  Mutation,
  Field,
  Arg,
  Ctx,
  UseMiddleware,
  InputType,
} from "type-graphql";
import { Usuario } from "../entity/Usuario";
import { interfaceCtx } from "../interface/InterfaceCtx";
import { crearToken } from "./aut/aut";
import { login } from "../middleware/login";
import { verify } from "jsonwebtoken";
import { hash, compare, compareSync } from "bcryptjs";
import { Tecnico } from "../entity/Tecnico";
import { Servicio } from '../entity/Servicio';

@InputType()
class CalificarInput {
  @Field()
  calificacion_servicio!: string;
}

@InputType()
class EstadoInput {
  @Field()
  estado_servicio!: string;
}




@ObjectType()
@Resolver()
export class ServicioResolver {
  @Mutation(() => Boolean)
  async actualizarEstadoServicio(
    @Arg("ticket_servicio") ticket_servicio: string,
    @Arg("datos") datos: EstadoInput
  ) {   

      await Servicio.update({ ticket_servicio }, datos);
      return true;
   
  }

  @Mutation(() => Boolean)
  async calificarServicio(
    @Arg("ticket_servicio") ticket_servicio: string,
    @Arg("datos") datos: CalificarInput,
    @Ctx() context: interfaceCtx
  ) {
    const authorization = context.req.headers["authorization"];
    if (!authorization) {
      throw new Error("el token ha expirado");
    }

    try {
      const token = authorization.split(" ")[1];
      const payload: any = verify(token, "llaveSecreta");

      await Servicio.update({ ticket_servicio }, datos);
      return true;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}

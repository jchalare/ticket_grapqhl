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
import { Servicio } from "../entity/Servicio";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken!: string;
  @Field(() => Usuario)
  datos_usuario!: Usuario;
}

@ObjectType()
class ticketResponse {
  @Field()
  ticket_servicio!: string;

  @Field()
  estado_servicio!: string;

  @Field()
  turno_servicio!: string;

  @Field(() => Usuario)
  id_usuario!: Usuario;

  @Field(() => Tecnico)
  id_tecnico!: Usuario;
}

@ObjectType()
@Resolver()
export class UsuarioResolver {
  @Query(() => Usuario, { nullable: true })
  validaUsuario(@Ctx() context: interfaceCtx) {
    const authorization = context.req.headers["authorization"];
    if (!authorization) {
      throw new Error("la sesion ha expirado");
    }

    try {
      const token = authorization.split(" ")[1];
      const payload: any = verify(token, "llaveSecreta");
      return Usuario.findOne(payload.id_usuario);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email_usuario") email_usuario: string,
    @Arg("clave_usuario") clave_usuario: string,
    @Ctx() { res }: interfaceCtx
  ): Promise<LoginResponse> {
    const datos_usuario = await Usuario.findOne({
      where: { email_usuario },
    });

    if (!datos_usuario) {
      throw new Error("datos incorrectos");
    }

    const valid = await compare(clave_usuario, datos_usuario.clave_usuario);

    if (!valid) {
      throw new Error("datos incorrectos");
    }

    const token = crearToken(datos_usuario);

    return {
      accessToken: token,
      datos_usuario,
    };
  }

  @Mutation(() => Boolean)
  async crearUsuario(
    @Arg("email_usuario") email_usuario: string,
    @Arg("clave_usuario") clave_usuario: string,
    @Arg("nombre_usuario") nombre_usuario: string
  ) {
    const claveUsuario = await hash(clave_usuario, 12);

    try {
      await Usuario.insert({
        email_usuario,
        clave_usuario: claveUsuario,
        nombre_usuario,
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }

  async generarCadena() {
    let turno: any;

    const letra = Math.random().toString(36).substring(7);

    const datoServicio = await Servicio.createQueryBuilder("turno_servicio")
      .where("fecha_servicio = current_date ")
      .orderBy({
        turno_servicio: "DESC",
      })
      .getOne();
    if (datoServicio) {
      turno = datoServicio.turno_servicio;
      turno = parseInt(turno) + 1;
    } else {
      turno = 1;
    }
    return { turno, letra };
  }

  @Mutation(() => ticketResponse)
  async generarTicket(@Ctx() context: interfaceCtx) {
    const authorization = context.req.headers["authorization"];
    if (!authorization) {
      throw new Error("la sesion ha expirado");
    }

    try {
      const token = authorization.split(" ")[1];
      const payload: any = verify(token, "llaveSecreta");
      const datoUsuario = await Usuario.findOne(payload.id_usuario);
      const datoTecnico = await Tecnico.createQueryBuilder("id_tecnico")
        .orderBy("random()")
        .getOne();

      if (datoTecnico === undefined) {
        throw new Error("No hay Tecnico disponible");
      }

      const datosTurno = await this.generarCadena();
      const turno_servicio = datosTurno.turno;
      const ticket = datosTurno.letra;

      const data = {
        ticket_servicio: ticket.slice(0, 4),
        turno_servicio,
        id_usuario: datoUsuario,
        id_tecnico: datoTecnico,
        calificacion_servicio: "PENDIENTE",
        estado_servicio: "PENDIENTE",
      };

      const nuevaSolicitud = Servicio.create(data);
      return await nuevaSolicitud.save();
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

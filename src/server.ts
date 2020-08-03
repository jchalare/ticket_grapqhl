import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { verify } from "jsonwebtoken";
import { UsuarioResolver } from "./resolvers/UsuarioResolver";
import { TecnicoResolver } from "./resolvers/TecnicoResolver";
import { Servicio } from "./entity/Servicio";
import { ServicioResolver } from "./resolvers/ServicioResolver";

export async function iniciarServer() {
  async function getServiciosTecnico(nombre_tecnico: string) {
    const datoServicios = await Servicio.createQueryBuilder("servicios")
      .select([
        "servicios.ticket_servicio",
        "servicios.turno_servicio",
        "servicios.fecha_servicio",
        "tecnico.nombre_tecnico",
        "servicios.calificacion_servicio as calificacion",
        "usuario.nombre_usuario",
      ])
      .innerJoin("servicios.id_tecnico", "tecnico")
      .innerJoin("servicios.id_usuario", "usuario")
      .where("tecnico.nombre_tecnico = :nombre", { nombre: nombre_tecnico })
      .getMany();

    if (datoServicios === undefined) {
      throw new Error("No hay servicios para el tecnico");
    }

    return datoServicios;
  }

  async function getServiciosUsuario(ticket: string) {
    const datoServicios = await Servicio.createQueryBuilder("servicios")
      .select([
        "servicios.ticket_servicio",
        "servicios.turno_servicio",
        "servicios.fecha_servicio",
        "servicios.estado_servicio",
        "tecnico.nombre_tecnico",
        "usuario.nombre_usuario",
        "servicios.calificacion_servicio",
      ])
      .innerJoin("servicios.id_tecnico", "tecnico")
      .innerJoin("servicios.id_usuario", "usuario")
      .where("servicios.ticket_servicio = :nombre", { nombre: ticket })
      .getMany();

    if (datoServicios === undefined) {
      throw new Error("ticket incorrecto");
    }

    return datoServicios;
  }

  const app = express();

  app.get("/tareas/:nombre_tecnico", async (req, res) => {
    const nombre_tecnico = req.params.nombre_tecnico;

    const servicios = await getServiciosTecnico(nombre_tecnico);

    res.json(servicios);
  });

  app.get("/servicio/:ticket", async (req, res) => {
    const ticket = req.params.ticket;
    const servicios = await getServiciosUsuario(ticket);

    res.json(servicios);
  });

  app.get("/graphql");
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UsuarioResolver, TecnicoResolver, ServicioResolver],
      validate: false,
    }),
    context: ({ req, res }: any) => ({ req, res }),
  });

  server.applyMiddleware({
    app,
  });

  return app;
}

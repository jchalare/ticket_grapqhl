import { createConnection } from "typeorm";
import path from "path";

export async function conexionBD() {
  await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "jachm",
    database: "db_tickets_service",
    entities: [path.join(__dirname, "../entity/**/**.ts")],
    synchronize: true,
  });
  console.log("base de datos conectada !");
}

import "reflect-metadata";
import { conexionBD } from "./config/db";
import { iniciarServer } from "./server";

async function main() {
  conexionBD();
  const app = await iniciarServer();
  app.listen(3000);
  console.log("Configuracion de server en puerto", 3000);
}
 
main();

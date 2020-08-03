import  * as jwt  from "jsonwebtoken";
import { Usuario } from "../../entity/Usuario";

export const crearToken = (usuario: Usuario) => {
         return jwt.sign({ id_usuario: usuario.id_usuario }, "llaveSecreta", {
           expiresIn: "1h",
         });
       };

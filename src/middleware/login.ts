import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { interfaceCtx } from "../interface/InterfaceCtx";

export const login: MiddlewareFn<interfaceCtx> = ({ context }, next) => {
   
  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    throw new Error("la sesion ha expirado");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, "llaveSecreta");
    context.payload = payload as any;
  } catch (err) {
    throw new Error("la sesion ha expirado");
  }

  return next();
};

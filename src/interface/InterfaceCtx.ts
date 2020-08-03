import { Request, Response } from "express";

export interface interfaceCtx {
  req: Request;
  res: Response;
  payload?: { id_usuario: string };
}

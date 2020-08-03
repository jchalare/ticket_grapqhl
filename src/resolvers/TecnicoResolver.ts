import { Resolver, Query, Mutation, Arg, Field, InputType } from "type-graphql";
import { Tecnico } from '../entity/Tecnico';


@Resolver()
export class TecnicoResolver {
  @Mutation(() => Tecnico)
  async crearTecnico(@Arg("nombre_tecnico") nombre_tecnico: string) {
    const nuevoTecnico = Tecnico.create({nombre_tecnico});
    return await nuevoTecnico.save();
  }

  @Query(() => [Tecnico])
  Tecnicos() {
    return Tecnico.find();
  }
}

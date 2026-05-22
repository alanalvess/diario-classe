import {Roles} from "../enums/Roles.ts";
import {TiposAcessos} from "../enums/TiposAcessos.ts"

export interface Acesso {
  id: number;
  pessoaId: number;
  nome: string;
  role?: Roles[];
  dataHora: string;
  tipo?: TiposAcessos[];
}
import {Roles} from "../enums/Roles.ts";
import {TiposAcessos} from "../enums/TiposAcessos.ts";

export interface RfidCartao {
  uid: string;
  email: string;
  ativo: boolean;
}
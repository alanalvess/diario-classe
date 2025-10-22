import type {Filiacao} from "../enums/Filiacao.ts";

export interface Responsavel {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  filiacao: Filiacao | null;
  alunoIds: number[];
}

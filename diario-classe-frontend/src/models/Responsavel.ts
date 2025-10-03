import Usuario from "./Usuario.ts";

export interface Responsavel {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  alunoIds: number[];
  // usuario: Usuario;
}

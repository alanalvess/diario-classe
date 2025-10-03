import Usuario from "./Usuario.ts";

export interface Aluno {
  id: number;
  nome: string;
  matricula: string;
  turmaId: number;
  dataNascimento: string;
  // usuario: Usuario;
}
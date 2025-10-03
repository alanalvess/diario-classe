import Usuario from "./Usuario";

export interface Professor {
  id: number;
  nome: string;
  email: string;
  disciplinaIds: number[];
  turmaIds?: number[];
  // usuario: Usuario;
}

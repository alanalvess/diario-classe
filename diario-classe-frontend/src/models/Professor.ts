import Usuario from "./Usuario";

export interface Professor {
  id: number;
  nome: string;
  disciplinaId: number;
  usuario: Usuario;
}

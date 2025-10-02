import Usuario from "./Usuario.ts";

export interface Avaliacao {
  id: number;
  titulo: string;
  data: string;
  peso: number;
  turmaId: number;
  disciplinaId: number;
  media: number;
}
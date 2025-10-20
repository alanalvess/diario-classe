export interface Avaliacao {
  id: number;
  titulo: string;
  data: string;
  peso: number;
  bimestre: number;
  turmaId: number;
  disciplinaId: number;
  media: number;
}
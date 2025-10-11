export interface Turma {
  id: number;
  nome: string;
  anoLetivo: string;
  mediaTurma?: number;
  frequenciaMedia?: number;
  professorIds: number[];
  professorNomes: string[];
  disciplinaIds: number[];
  disciplinaNomes: string[];
  alunoIds: number[];
  alunoNomes: string[];
}

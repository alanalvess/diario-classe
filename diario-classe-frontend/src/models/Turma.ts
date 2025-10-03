import {Aluno} from "./Aluno.ts";
import {Professor} from "./Professor.ts";

export interface Turma {
  // id: number;
  // nome: string;
  // ano: number;
  // alunos?: Aluno[];
  // professores?: Professor[];
  id: number;
  nome: string;
  anoLetivo: string;
  mediaTurma?: number;
  frequenciaMedia?: number;
  professorIds: number[];
  disciplinaIds: number[];
  alunoIds: number[];
}

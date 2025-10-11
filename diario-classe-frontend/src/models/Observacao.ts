import type {CategoriaObservacao} from "../enums/CategoriaObservacao.ts";

export interface Observacao {
  id: number;
  data: string;
  categoria: CategoriaObservacao;
  descricao: string;
  alunoId: number;
  professorId: number;
  turmaId: number;
  disciplinaId: number;
}

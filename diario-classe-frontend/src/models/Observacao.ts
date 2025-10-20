import type {CategoriaObservacao} from "../enums/CategoriaObservacao.ts";

export interface Observacao {
  id: number;
  data: string;
  categoria: CategoriaObservacao;
  descricao: string;
  alunoId: number;
  alunoNome?: string;
  professorId: number;
  professorNome?: string;
  turmaId: number;
  turmaNome?: string;
  disciplinaId: number;
  disciplinaNome?: string;
}

export interface Nota {
  id: number;
  alunoId: number;
  alunoNome: string;
  disciplinaId: number;
  disciplinaNome?: string;
  valor: number;
  observacao?: string;
  avaliacaoId?: number;
  avaliacaoTitulo?: string;
  dataLancamento?: string;
  mediaTurma?: string;
}

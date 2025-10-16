export interface Alerta {
  id: number;
  alunoId: number;
  alunoNome: string;
  riscoReprovacao: boolean;
  riscoEvasao: boolean;
  scoreRisco: number;
  dataGeracao: string;
  status: string;
  mensagemResumo: string;
}
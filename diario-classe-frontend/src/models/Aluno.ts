export interface Aluno {
  id: number;
  nome: string;
  matricula: string;
  turmaId: number;
  turmaNome?: string;
  dataNascimento: string;
}
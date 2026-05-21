export interface Aluno {
  id: number;
  nome: string;
  matricula: string;
  email: string;
  turmaId: number;
  turmaNome?: string;
  dataNascimento: string;
}
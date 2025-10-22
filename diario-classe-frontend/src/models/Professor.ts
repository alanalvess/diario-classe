export interface Professor {
  id: number;
  nome: string;
  email: string;
  disciplinaIds: number[];
  disciplinaNomes?: string[];
  turmaIds?: number[];
  turmaNomes?: string[];
}

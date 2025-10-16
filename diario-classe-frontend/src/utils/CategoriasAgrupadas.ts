import {CategoriaObservacao} from "../enums/CategoriaObservacao.ts";

export const CategoriasAgrupadas = {
  Acadêmicas: [
    CategoriaObservacao.ATIVIDADE,
    CategoriaObservacao.DESEMPENHO,
    CategoriaObservacao.PARTICIPACAO,
  ],
  Comportamentais: [
    CategoriaObservacao.COMPORTAMENTO,
    CategoriaObservacao.INDISCIPLINA,
  ],
  Socioemocionais: [
    CategoriaObservacao.SAUDE,
    CategoriaObservacao.EMOCIONAL,
  ],
  Administrativas: [
    CategoriaObservacao.FALTA,
    CategoriaObservacao.JUSTIFICATIVA,
    CategoriaObservacao.REUNIAO,
    CategoriaObservacao.OBSERVACAO_GERAL,
  ],
};
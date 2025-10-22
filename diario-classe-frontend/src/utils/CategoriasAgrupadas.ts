import {CategoriaObservacao} from "../enums/CategoriaObservacao.ts";

export const CategoriasAgrupadas = {
  Acadêmicas: [
    {value: CategoriaObservacao.ATIVIDADE, label: 'Atividade'},
    {value: CategoriaObservacao.DESEMPENHO, label: 'Desempenho'},
    {value: CategoriaObservacao.PARTICIPACAO, label: 'Participação'},
  ],
  Comportamentais: [
    {value: CategoriaObservacao.COMPORTAMENTO, label: 'Comportamento'},
    {value: CategoriaObservacao.INDISCIPLINA, label: 'Indisciplina'},
  ],
  Socioemocionais: [
    {value: CategoriaObservacao.SAUDE, label: 'Saúde'},
    {value: CategoriaObservacao.EMOCIONAL, label: 'Emocional'},
  ],
  Administrativas: [
    {value: CategoriaObservacao.FALTA, label: 'Falta'},
    {value: CategoriaObservacao.JUSTIFICATIVA, label: 'Justificativa'},
    {value: CategoriaObservacao.REUNIAO, label: 'Reunião'},
    {value: CategoriaObservacao.OBSERVACAO_GERAL, label: 'Observação geral'},
  ],
}

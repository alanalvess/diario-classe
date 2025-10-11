package com.projetointegrador.diarioclasse.dto.response;

import java.util.List;

public record TurmaResponse(
        Long id,
        String nome,
        String anoLetivo,
        Double mediaTurma,
        Double frequenciaMedia,
        List<Long> professorIds,
        List<String> professorNomes,
        List<Long> disciplinaIds,
        List<String> disciplinaNomes,
        List<Long> alunoIds,
        List<String> alunoNomes
) {
}

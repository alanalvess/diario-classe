package com.projetointegrador.diarioclasse.dto.response;

import com.projetointegrador.diarioclasse.entity.Aluno;

import java.util.List;
import java.util.Set;

public record TurmaResponse(
        Long id,
        String nome,
        String anoLetivo,
        Double mediaTurma,
        Double frequenciaMedia,
        Set<Long> professorIds,
        List<Long> disciplinaIds,
        List<Long> alunoIds
) {
}

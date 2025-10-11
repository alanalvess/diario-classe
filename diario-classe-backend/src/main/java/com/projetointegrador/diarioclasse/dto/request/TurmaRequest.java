package com.projetointegrador.diarioclasse.dto.request;

import com.projetointegrador.diarioclasse.entity.Aluno;

import java.util.List;

public record TurmaRequest(
        String nome,
        String anoLetivo,
        List<Long> professorIds,
        List<Long> disciplinaIds
) {
}

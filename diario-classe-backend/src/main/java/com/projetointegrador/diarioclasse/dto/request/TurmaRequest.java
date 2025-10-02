package com.projetointegrador.diarioclasse.dto.request;

import com.projetointegrador.diarioclasse.entity.Aluno;

import java.util.List;
import java.util.Set;

public record TurmaRequest(
        String nome,
        String anoLetivo,
        Set<Long> professorIds,
        List<Long> disciplinaIds
) {
}

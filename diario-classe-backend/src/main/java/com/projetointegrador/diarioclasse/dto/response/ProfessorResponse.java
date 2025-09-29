package com.projetointegrador.diarioclasse.dto.response;

import com.projetointegrador.diarioclasse.entity.Disciplina;
import com.projetointegrador.diarioclasse.entity.Turma;

import java.util.List;
import java.util.Set;

public record ProfessorResponse(
        Long id,
        String nome,
        String email,
        Set<Long> disciplinaIds,
        List<Long> turmaIds
) {
}

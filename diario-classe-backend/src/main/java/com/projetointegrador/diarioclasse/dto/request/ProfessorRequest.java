package com.projetointegrador.diarioclasse.dto.request;

import com.projetointegrador.diarioclasse.entity.Disciplina;
import com.projetointegrador.diarioclasse.entity.Turma;

import java.util.List;
import java.util.Set;

public record ProfessorRequest(
        Long id,
        String nome,
        String email,
        Set<Disciplina> disciplinas,
        List<Turma> turmas
) {
}

package com.projetointegrador.diarioclasse.dto.response;

import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.entity.Turma;

import java.time.LocalDate;

public record PresencaResponse(
        Long id,
        LocalDate data,
        Boolean presente,
        Long alunoId,
        Long turmaId,
        String metodoChamada
) {
}

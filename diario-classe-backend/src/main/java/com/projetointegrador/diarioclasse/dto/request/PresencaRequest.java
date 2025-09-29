package com.projetointegrador.diarioclasse.dto.request;

import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.entity.Turma;

import java.time.LocalDate;

public record PresencaRequest(
        LocalDate data,
        Boolean presente,
        Long alunoId,
        Long turmaId,
        String metodoChamada
) {
}

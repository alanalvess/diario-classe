package com.projetointegrador.diarioclasse.dto.request;

import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.entity.Turma;

import java.time.LocalDate;

public record PresencaRequest(
        Long id,
        LocalDate data,
        Boolean presente,
        Aluno aluno,
        Turma turma,
        String metodoChamada
) {
}

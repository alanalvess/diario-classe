package com.projetointegrador.diarioclasse.dto.request;

import com.projetointegrador.diarioclasse.entity.Responsavel;
import com.projetointegrador.diarioclasse.entity.Turma;

import java.time.LocalDate;
import java.util.Set;

public record AlunoRequest(
        String nome,
        String matricula,
        LocalDate dataNascimento,
        Long turmaId
) {
}

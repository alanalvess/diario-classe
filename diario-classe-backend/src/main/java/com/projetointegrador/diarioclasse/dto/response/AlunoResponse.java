package com.projetointegrador.diarioclasse.dto.response;

import com.projetointegrador.diarioclasse.entity.Responsavel;
import com.projetointegrador.diarioclasse.entity.Turma;

import java.time.LocalDate;
import java.util.Set;

public record AlunoResponse(
        Long id,
        String nome,
        String matricula,
        LocalDate dataNascimento,
        Long turmaId
) {
}

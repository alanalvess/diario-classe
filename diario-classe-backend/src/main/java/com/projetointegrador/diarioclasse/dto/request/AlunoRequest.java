package com.projetointegrador.diarioclasse.dto.request;

import com.projetointegrador.diarioclasse.entity.Responsavel;
import com.projetointegrador.diarioclasse.entity.Turma;

import java.time.LocalDate;
import java.util.Set;

public record AlunoRequest(
        Long id,
        String nome,
        String matricula,
        LocalDate dataNascimento,
        Double mediaGeral,
        Double frequenciaGeral,
        Boolean riscoReprovacao,
        Boolean riscoEvasao,
        Turma turma,
        Set<Responsavel> responsaveis
) {
}

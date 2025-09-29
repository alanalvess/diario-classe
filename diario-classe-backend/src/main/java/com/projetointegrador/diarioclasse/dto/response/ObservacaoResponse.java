package com.projetointegrador.diarioclasse.dto.response;

import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.entity.Professor;

import java.time.LocalDate;

public record ObservacaoResponse(
        Long id,
        LocalDate data,
        String descricao,
        String categoria,
        Long professorId,
        Long alunoId
) {
}

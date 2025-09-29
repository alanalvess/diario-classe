package com.projetointegrador.diarioclasse.dto.request;

import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.entity.Professor;

import java.time.LocalDate;

public record ObservacaoRequest(
        LocalDate data,
        String descricao,
        String categoria,
        Long professorId,
        Long alunoId
) {
}

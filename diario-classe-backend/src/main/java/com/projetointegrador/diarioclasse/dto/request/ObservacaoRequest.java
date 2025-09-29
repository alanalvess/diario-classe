package com.projetointegrador.diarioclasse.dto.request;

import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.entity.Professor;

import java.time.LocalDate;

public record ObservacaoRequest(
        Long id,
        LocalDate data,
        String descricao,
        Professor professor,
        Aluno aluno,
        String categoria
) {
}

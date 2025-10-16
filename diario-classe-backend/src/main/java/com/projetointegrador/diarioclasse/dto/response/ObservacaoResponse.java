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
        String professorNome,
        Long alunoId,
        String alunoNome,
        Long turmaId,
        String turmaNome,
        Long disciplinaId,
        String disciplinaNome
) {
}

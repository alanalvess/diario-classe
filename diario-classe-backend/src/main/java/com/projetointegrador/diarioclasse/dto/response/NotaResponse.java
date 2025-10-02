package com.projetointegrador.diarioclasse.dto.response;

import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.entity.Avaliacao;
import com.projetointegrador.diarioclasse.entity.Disciplina;

import java.time.LocalDate;

public record NotaResponse(
        Long id,
        Double valor,
        Long alunoId,
        String alunoNome,
        Long disciplinaId,
        Long avaliacaoId,
        LocalDate dataLancamento
) {
}

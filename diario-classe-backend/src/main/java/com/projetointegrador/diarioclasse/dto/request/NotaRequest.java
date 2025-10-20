package com.projetointegrador.diarioclasse.dto.request;

import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.entity.Avaliacao;
import com.projetointegrador.diarioclasse.entity.Disciplina;

import java.time.LocalDate;

public record NotaRequest(
        Double valor,
        LocalDate dataLancamento,
        Long alunoId,
        Long disciplinaId,
        Long avaliacaoId
) {
}

package com.projetointegrador.diarioclasse.dto.response;

import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.entity.Avaliacao;
import com.projetointegrador.diarioclasse.entity.Disciplina;

import java.time.LocalDate;

public record NotaResponse(
        Long id,
        Double valor,
        Aluno aluno,
        Disciplina disciplina,
        Avaliacao avaliacao,
        LocalDate dataLancamento
) {
}

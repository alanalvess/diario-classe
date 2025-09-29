package com.projetointegrador.diarioclasse.dto.request;

import com.projetointegrador.diarioclasse.entity.Disciplina;
import com.projetointegrador.diarioclasse.entity.Nota;
import com.projetointegrador.diarioclasse.entity.Turma;

import java.time.LocalDate;
import java.util.List;

public record AvaliacaoRequest(
        String titulo,
        LocalDate data,
        Double peso,
        Long turmaId,
        Long disciplinaId
) {
}
